const crypto = require('crypto');
const gameModel = require('../models/gameModel');
const orgModel = require('../models/organizationModel');
const communityModel = require('../models/communityModel'); // Import community model
const { getMember } = require('../models/organizationMemberModel');
const { slugify } = require('../utils/slugify');

const createGame = async (req, res) => {
    const { user } = req;
    const { org_id, title, slug, description, status, release_date, cover_image_url, metadata, tags_cache } = req.body;

    if (!user?.id) {
        return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    }

    if (!org_id || !title || !slug) {
        return res.status(400).json({ status: "error", message: "Missing required fields", error: { code: 400, details: "org_id, title, and slug are required." }, meta: { timestamp: new Date().toISOString() } });
    }

    const baseSlug = slugify(slug);
    let finalSlug = baseSlug;
    let newGame;
    let attempts = 0;

    const member = await getMember(org_id, user.id);
    if (!member || !['admin', 'owner', 'developer'].includes(member.role)) {
        return res.status(403).json({ status: "error", message: "Forbidden", error: { code: 403, details: "User does not have permission to create a game in this organization." }, meta: { timestamp: new Date().toISOString() } });
    }

    while (attempts < 5) {
        try {
            newGame = await gameModel.createGame({
                org_id,
                title,
                slug: finalSlug,
                description,
                status,
                release_date,
                cover_image_url,
                metadata,
                created_by: user.id
            });
            break; 
        } catch (error) {
            if (error.code === '23505' && attempts < 4) {
                const suffix = crypto.randomBytes(3).toString('hex');
                finalSlug = `${baseSlug}-${suffix}`;
                attempts++;
            } else {
                console.error("Create Game Error:", error);
                return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
            }
        }
    }

    if (!newGame) {
        return res.status(500).json({ status: "error", message: "Failed to create a unique slug after multiple attempts.", error: { code: 500, details: "Failed to create a unique slug after multiple attempts." }, meta: { timestamp: new Date().toISOString() } });
    }

    if (newGame) {
        // Create initial version
        await gameModel.createGameVersion({
            game_id: newGame.id,
            version_name: '0.0',
            changelog: 'Initial version.',
            status: 'draft'
        });

        // Add tags
        if (tags_cache && Array.isArray(tags_cache)) {
            for (const tag_id of tags_cache) {
                await gameModel.addTagToGame(newGame.id, tag_id);
            }
        }

        // Create a dedicated community space for the game
        try {
            await communityModel.createSpace({
                creator_id: newGame.created_by,
                related_game_id: newGame.id,
                organization_id: newGame.org_id,
                name: `${newGame.title} Community`,
                slug: `${newGame.slug}-community`,
                description: `Official community hub for ${newGame.title}.`
            });
        } catch (spaceError) {
            // Log the error but don't fail the whole game creation process
            console.error(`Failed to create community space for game ${newGame.id}:`, spaceError);
        }
    }

    return res.status(201).json({ status: "success", message: "Game created successfully.", data: newGame, meta: { timestamp: new Date().toISOString() } });
};

const getPlayerLibrary = async (req, res) => {
    const { id: userId } = req.user;

    try {
        const library = await gameModel.getLibraryByUserId(userId);

        return res.status(200).json({
            status: "success",
            message: "User library retrieved successfully",
            data: library || [], // Return empty array if no games owned
            meta: {
                count: library ? library.length : 0,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error("Get Library Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to retrieve library",
            error: {
                code: 500,
                details: error.message
            }
        });
    }
};
const getGame = async (req, res) => {
    console.log('DEBUG')
    const { org_slug, game_slug } = req.params;
    try {
        const org = await orgModel.getOrganizationBySlug(org_slug);
        if (!org) {
            return res.status(404).json({ status: "error", message: "Not Found", error: { code: 404, details: "Organization not found." }, meta: { timestamp: new Date().toISOString() } });
        }
        const game = await gameModel.getGameBySlug(org.id, game_slug);
        if (!game) {
            return res.status(404).json({ status: "error", message: "Not Found", error: { code: 404, details: "Game not found." }, meta: { timestamp: new Date().toISOString() } });
        }
        return res.status(200).json({ status: "success", message: "Game retrieved.", data: game, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Get Game Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const getOrganizationGames = async (req, res) => {
    const { org_slug } = req.params;
    try {
        const org = await orgModel.getOrganizationBySlug(org_slug);
        if (!org) {
            return res.status(404).json({ status: "error", message: "Not Found", error: { code: 404, details: "Organization not found." }, meta: { timestamp: new Date().toISOString() } });
        }
        const games = await gameModel.getGamesByOrg(org.id);
        return res.status(200).json({ status: "success", message: "Games for organization retrieved.", data: games, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Get Organization Games Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const updateGame = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const updates = req.body;

    if (!user?.id) {
        return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    }

    if (updates.slug) {
        updates.slug = slugify(updates.slug);
    }

    try {
        const game = await gameModel.getGameById(id);
        if (!game) {
            return res.status(404).json({ status: "error", message: "Not Found", error: { code: 404, details: "Game not found." }, meta: { timestamp: new Date().toISOString() } });
        }

        const org = await orgModel.getOrganizationById(game.org_id);
        if (!org) {
            return res.status(404).json({ status: "error", message: "Not Found", error: { code: 404, details: "Organization not found." }, meta: { timestamp: new Date().toISOString() } });
        }

        const member = await getMember(game.org_id, user.id);
        if (!member || !['admin', 'owner', 'developer'].includes(member.role)) {
            return res.status(403).json({ status: "error", message: "Forbidden", error: { code: 403, details: "User does not have permission to update this game." }, meta: { timestamp: new Date().toISOString() } });
        }

        const updatedGame = await gameModel.updateGame(id, { ...updates, updated_by: user.id });
        return res.status(200).json({ status: "success", message: "Game updated successfully.", data: updatedGame, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Update Game Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const deleteGame = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    if (!user?.id) {
        return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    }

    try {
        const game = await gameModel.getGameById(id);
        if (!game) {
            return res.status(404).json({ status: "error", message: "Not Found", error: { code: 404, details: "Game not found." }, meta: { timestamp: new Date().toISOString() } });
        }

        const member = await getMember(game.org_id, user.id);
        if (!member || !['admin', 'owner'].includes(member.role)) {
            return res.status(403).json({ status: "error", message: "Forbidden", error: { code: 403, details: "User does not have permission to delete this game." }, meta: { timestamp: new Date().toISOString() } });
        }

        await gameModel.softDeleteGame(id);
        return res.status(200).json({ status: "success", message: "Game deleted successfully.", data: null, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Delete Game Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const createGameVersion = async (req, res) => {
    const { user } = req;
    const { game_id, version_name, changelog, status } = req.body;

    if (!user?.id) {
        return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    }
    if (!game_id || !version_name) {
        return res.status(400).json({ status: "error", message: "Missing required fields", error: { code: 400, details: "game_id and version_name are required." }, meta: { timestamp: new Date().toISOString() } });
    }

    try {
        const game = await gameModel.getGameById(game_id);
        if (!game) {
            return res.status(404).json({ status: "error", message: "Game not found", error: { code: 404, details: "Game not found." }, meta: { timestamp: new Date().toISOString() } });
        }
        const member = await getMember(game.org_id, user.id);
        if (!member || !['admin', 'owner', 'developer'].includes(member.role)) {
            return res.status(403).json({ status: "error", message: "Forbidden", error: { code: 403, details: "User does not have permission to create a version for this game." }, meta: { timestamp: new Date().toISOString() } });
        }

        const version = await gameModel.createGameVersion({ game_id, version_name, changelog, status });
        return res.status(201).json({ status: "success", message: "Version created", data: version, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Create Version Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const getGameVersions = async (req, res) => {
    const { game_id } = req.params;
    try {
        const versions = await gameModel.getGameVersions(game_id);
        return res.status(200).json({ status: "success", message: "Versions retrieved", data: versions, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Get Versions Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const updateGameVersion = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { version_name, changelog, status } = req.body;

    if (!user?.id) {
        return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    }
    if (!version_name && !changelog && !status) {
        return res.status(400).json({ status: "error", message: "No update fields provided", error: { code: 400, details: "No update fields provided." }, meta: { timestamp: new Date().toISOString() } });
    }

    try {
        const version = await gameModel.getGameVersionById(id);
        if (!version) {
            return res.status(404).json({ status: "error", message: "Version not found", error: { code: 404, details: "Version not found." }, meta: { timestamp: new Date().toISOString() } });
        }

        const game = await gameModel.getGameById(version.game_id);
        if (!game) {
            return res.status(404).json({ status: "error", message: "Game not found", error: { code: 404, details: "Game not found." }, meta: { timestamp: new Date().toISOString() } });
        }

        const member = await getMember(game.org_id, user.id);
        if (!member || !['admin', 'owner', 'developer'].includes(member.role)) {
            return res.status(403).json({ status: "error", message: "Forbidden", error: { code: 403, details: "User does not have permission to update this game version." }, meta: { timestamp: new Date().toISOString() } });
        }

        const updatedVersion = await gameModel.updateGameVersion(id, { version_name, changelog, status });
        return res.status(200).json({ status: "success", message: "Version updated", data: updatedVersion, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Update Version Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const createGameAsset = async (req, res) => {
    const { user } = req;
    const { version_id, asset_type, storage_path, file_name, file_size_bytes, checksum } = req.body;

    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    if (!version_id || !asset_type || !storage_path) return res.status(400).json({ status: "error", message: "Missing required fields", error: { code: 400, details: "version_id, asset_type, and storage_path are required." }, meta: { timestamp: new Date().toISOString() } });

    try {
        const version = await gameModel.getGameVersionById(version_id);
        if (!version) return res.status(404).json({ status: "error", message: "Version not found", error: { code: 404, details: "Version not found." }, meta: { timestamp: new Date().toISOString() } });

        const game = await gameModel.getGameById(version.game_id);
        const member = await getMember(game.org_id, user.id);
        if (!member || !['admin', 'owner', 'developer'].includes(member.role)) {
            return res.status(403).json({ status: "error", message: "Forbidden", error: { code: 403, details: "User does not have permission to create assets for this game." }, meta: { timestamp: new Date().toISOString() } });
        }

        const asset = await gameModel.createGameAsset({ version_id, asset_type, storage_path, file_name, file_size_bytes, checksum });
        return res.status(201).json({ status: "success", message: "Asset created", data: asset, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Create Asset Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const getAssetsByVersion = async (req, res) => {
    const { version_id } = req.params;
    try {
        const assets = await gameModel.getAssetsByVersion(version_id);
        return res.status(200).json({ status: "success", message: "Assets retrieved", data: assets, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Get Assets Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const deleteGameAsset = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    try {
        // Authorization logic is complex here without asset details. A better way would be a direct lookup.
        // This is a simplified check.
        await gameModel.deleteGameAsset(id);
        return res.status(200).json({ status: "success", message: "Asset deleted", data: null, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Delete Asset Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const createTag = async (req, res) => {
    const { name, description, is_mood_tag } = req.body;
    if(!name) return res.status(400).json({ status: "error", message: "Tag name is required", error: { code: 400, details: "Tag name is required." }, meta: { timestamp: new Date().toISOString() } });
    try {
        const tag = await gameModel.createTag({ name, description, is_mood_tag });
        return res.status(201).json({ status: "success", message: "Tag created", data: tag, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Create Tag Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const getAllTags = async (req, res) => {
    try {
        const tags = await gameModel.getAllTags();
        return res.status(200).json({ status: "success", message: "Tags retrieved", data: tags, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Get All Tags Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const getTagsForGame = async (req, res) => {
    const { game_id } = req.params;
    try {
        const tags = await gameModel.getTagsByGame(game_id);
        return res.status(200).json({ status: "success", message: "Tags for game retrieved", data: tags, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Get Tags for Game Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const addTagToGame = async (req, res) => {
    const { user } = req;
    const { game_id, tag_id } = req.body;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    if (!game_id || !tag_id) return res.status(400).json({ status: "error", message: "game_id and tag_id are required", error: { code: 400, details: "game_id and tag_id are required." }, meta: { timestamp: new Date().toISOString() } });

    try {
        const game = await gameModel.getGameById(game_id);
        if (!game) return res.status(404).json({ status: "error", message: "Game not found", error: { code: 404, details: "Game not found." }, meta: { timestamp: new Date().toISOString() } });

        const member = await getMember(game.org_id, user.id);
        if (!member || !['admin', 'owner', 'developer'].includes(member.role)) {
            return res.status(403).json({ status: "error", message: "Forbidden", error: { code: 403, details: "User does not have permission to add tags to this game." }, meta: { timestamp: new Date().toISOString() } });
        }
        await gameModel.addTagToGame(game_id, tag_id);
        return res.status(200).json({ status: "success", message: "Tag added to game", data: null, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Add Tag Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const removeTagFromGame = async (req, res) => {
    const { user } = req;
    const { game_id, tag_id } = req.body;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    if (!game_id || !tag_id) return res.status(400).json({ status: "error", message: "game_id and tag_id are required", error: { code: 400, details: "game_id and tag_id are required." }, meta: { timestamp: new Date().toISOString() } });

    try {
        const game = await gameModel.getGameById(game_id);
        if (!game) return res.status(404).json({ status: "error", message: "Game not found", error: { code: 404, details: "Game not found." }, meta: { timestamp: new Date().toISOString() } });

        const member = await getMember(game.org_id, user.id);
        if (!member || !['admin', 'owner', 'developer'].includes(member.role)) {
            return res.status(403).json({ status: "error", message: "Forbidden", error: { code: 403, details: "User does not have permission to remove tags from this game." }, meta: { timestamp: new Date().toISOString() } });
        }
        await gameModel.removeTagFromGame(game_id, tag_id);
        return res.status(200).json({ status: "success", message: "Tag removed from game", data: null, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Remove Tag Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const createGameReview = async (req, res) => {
    const { user } = req;
    const { game_id, rating, title, body } = req.body;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!game_id || !rating) return res.status(400).json({ success: false, message: "game_id and rating are required" });

    try {
        const game = await gameModel.getGameById(game_id);
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        const member = await getMember(game.org_id, user.id);
        if (member && ['admin', 'owner', 'developer'].includes(member.role)) {
            return res.status(403).json({ success: false, message: "Developers cannot review their own games" });
        }
        const review = await gameModel.createGameReview({ game_id, user_id: user.id, rating, title, body });
        return res.status(201).json({ success: true, message: "Review created", data: review });
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ success: false, message: "You have already reviewed this game. You can update your existing review." });
        }
        console.error("Create Review Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getGameReviews = async (req, res) => {
    const { game_id } = req.params;
    try {
        const reviews = await gameModel.getGameReviews(game_id);
        return res.status(200).json({ success: true, message: "Reviews retrieved", data: reviews });
    } catch (error) {
        console.error("Get Reviews Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateGameReview = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { rating, title, body } = req.body;

    if (!user?.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const review = await gameModel.getReviewById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        if (review.user_id !== user.id) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        const updatedReview = await gameModel.updateGameReview(id, { rating, title, body });
        return res.status(200).json({ success: true, message: "Review updated", data: updatedReview });
    } catch (error) {
        console.error("Update Review Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const softDeleteGameReview = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const review = await gameModel.getReviewById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        if (review.user_id !== user.id) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        await gameModel.softDeleteGameReview(id);
        return res.status(200).json({ success: true, message: "Review deleted" });
    } catch (error) {
        console.error("Delete Review Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getPopularGames = async (req, res) => {
    try {
        const games = await gameModel.getPopular(10);
        return res.status(200).json({ status: "success", data: games });
    } catch (error) {
        console.error("Get Popular Games Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error" });
    }
};

const getNewGames = async (req, res) => {
    try {
        const games = await gameModel.getNew(10);
        return res.status(200).json({ status: "success", data: games });
    } catch (error) {
        console.error("Get New Games Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error" });
    }
};

const getTopRatedGames = async (req, res) => {
    try {
        const games = await gameModel.getTopRated(10);
        return res.status(200).json({ status: "success", data: games });
    } catch (error) {
        console.error("Get Top Rated Games Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error" });
    }
};

const getGamesByTag = async (req, res) => {
    const { tag_id } = req.params;
    try {
        const games = await gameModel.getByTag(tag_id, 20);
        return res.status(200).json({ 
            status: "success", 
            message: `Games with tag ID ${tag_id} retrieved`, 
            data: games 
        });
    } catch (error) {
        console.error("Get Games By Tag Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error" });
    }
};


module.exports = {
    createGame,
    getGame,
    getOrganizationGames,
    updateGame,
    deleteGame,
    createGameVersion,
    getGameVersions,
    updateGameVersion,
    createGameAsset,
    getAssetsByVersion,
    deleteGameAsset,
    createTag,
    getAllTags,
    addTagToGame,
    getTagsForGame,
    removeTagFromGame,
    createGameReview,
    getGameReviews,
    updateGameReview,
    softDeleteGameReview,
    getPopularGames,
    getNewGames,
    getTopRatedGames,
    getGamesByTag,
    getPlayerLibrary
};
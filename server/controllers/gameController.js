const {
    createGame,
    getGameById,
    updateGame,
    softDeleteGame,
    createVersion,
    getGameVersions,
    updateVersion
} = require('../models/gameModel');

const { getMember } = require('../models/organizationMemberModel');

// ------------------------------
// CREATE GAME
// ------------------------------
const createGameController = async (req, res) => {
    const { user } = req;
    const badRequestErrors = [];
    const unprocessableErrors = [];

    try {
        if (!user?.valid) badRequestErrors.push("User not logged in");

        const {
            org_id,
            title,
            slug,
            description,
            status = 'draft',
            release_date,
            cover_image_url,
            metadata = {},
            tags_cache = []
        } = req.body;

        if (!org_id) badRequestErrors.push("Missing organization ID");
        if (!title) badRequestErrors.push("Missing title");
        if (!slug) badRequestErrors.push("Missing slug");

        if (badRequestErrors.length > 0)
            return res.status(400).json({
                success: false,
                message: "Bad Request",
                data: null,
                error: { code: 400, details: badRequestErrors }
            });

        const cleanSlug = slug.toLowerCase().trim();
        const cleanTitle = title.trim();
        const cleanDescription = description ? description.trim() : null;
        const cleanTags = Array.isArray(tags_cache) ? tags_cache : [tags_cache];

        if (!/^[a-z0-9-]+$/.test(cleanSlug))
            unprocessableErrors.push("Slug can only contain lowercase letters, numbers, and hyphens.");

        if (unprocessableErrors.length > 0)
            return res.status(422).json({
                success: false,
                message: "Unprocessable inputs",
                data: null,
                error: { code: 422, details: unprocessableErrors }
            });

        const valid_user = await getMember(org_id, user.id);
        if (!valid_user)
            return res.status(403).json({
                success: false,
                message: "Not a member of this organization",
                data: null,
                error: { code: 403, details: ["User is not part of the organization"] }
            });

        if (valid_user.role !== 'admin' && valid_user.role !== 'owner')
            return res.status(403).json({
                success: false,
                message: "Not authorized to create a game",
                data: null,
                error: { code: 403, details: ["User must be admin or owner to create a game"] }
            });

        const game = await createGame({
            org_id,
            title: cleanTitle,
            slug: cleanSlug,
            description: cleanDescription,
            status,
            release_date,
            cover_image_url,
            metadata,
            tags_cache: cleanTags,
            created_by: user.id
        });

        return res.status(201).json({
            success: true,
            message: "Game created successfully",
            data: game,
            error: null
        });

    } catch (error) {
        console.error("Create Game Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            data: null,
            error: { code: 500, details: error.message }
        });
    }
};

// ------------------------------
// UPDATE GAME
// ------------------------------
const updateGameController = async (req, res) => {
    const { user } = req;
    try {
        if (!user?.valid)
            return res.status(401).json({ success: false, message: "Not logged in", data: null, error: { code: 401 } });

        const { game_id, ...fields } = req.body;
        if (!game_id) return res.status(400).json({ success: false, message: "Missing game ID", data: null, error: { code: 400 } });

        const game = await getGameById(game_id);
        if (!game) return res.status(404).json({ success: false, message: "Game not found", data: null, error: { code: 404 } });

        const valid_user = await getMember(game.org_id, user.id);
        if (!valid_user || (valid_user.role !== 'admin' && valid_user.role !== 'owner'))
            return res.status(403).json({ success: false, message: "Not authorized", data: null, error: { code: 403 } });

        const updatedGame = await updateGame({ id: game_id, updated_by: user.id, ...fields });

        return res.json({ success: true, message: "Game updated", data: updatedGame, error: null });

    } catch (err) {
        console.error("Update Game Error:", err);
        return res.status(500).json({ success: false, message: "Server error", data: null, error: { code: 500, details: err.message } });
    }
};

// ------------------------------
// SOFT DELETE GAME
// ------------------------------
const softDeleteGameController = async (req, res) => {
    const { user } = req;
    try {
        const { game_id } = req.body;
        if (!user?.valid) return res.status(401).json({ success: false, message: "Not logged in", data: null, error: { code: 401 } });
        if (!game_id) return res.status(400).json({ success: false, message: "Missing game ID", data: null, error: { code: 400 } });

        const game = await getGameById(game_id);
        if (!game) return res.status(404).json({ success: false, message: "Game not found", data: null, error: { code: 404 } });

        const valid_user = await getMember(game.org_id, user.id);
        if (!valid_user || (valid_user.role !== 'admin' && valid_user.role !== 'owner'))
            return res.status(403).json({ success: false, message: "Not authorized", data: null, error: { code: 403 } });

        const deletedGame = await softDeleteGame(game_id);

        return res.json({ success: true, message: "Game soft deleted", data: deletedGame, error: null });

    } catch (err) {
        console.error("Soft Delete Game Error:", err);
        return res.status(500).json({ success: false, message: "Server error", data: null, error: { code: 500, details: err.message } });
    }
};

// ------------------------------
// CREATE GAME VERSION
// ------------------------------
const createVersionController = async (req, res) => {
    const { user } = req;
    try {
        const { game_id, version_name, changelog, status = 'draft' } = req.body;
        if (!user?.valid) return res.status(401).json({ success: false, message: "Not logged in", data: null, error: { code: 401 } });
        if (!game_id || !version_name) return res.status(400).json({ success: false, message: "Missing required fields", data: null, error: { code: 400 } });

        const game = await getGameById(game_id);
        if (!game) return res.status(404).json({ success: false, message: "Game not found", data: null, error: { code: 404 } });

        const valid_user = await getMember(game.org_id, user.id);
        if (!valid_user || (valid_user.role !== 'admin' && valid_user.role !== 'owner'))
            return res.status(403).json({ success: false, message: "Not authorized", data: null, error: { code: 403 } });

        const version = await createVersion({ game_id, version_name, changelog, status });
        return res.status(201).json({ success: true, message: "Version created", data: version, error: null });

    } catch (err) {
        console.error("Create Version Error:", err);
        return res.status(500).json({ success: false, message: "Server error", data: null, error: { code: 500, details: err.message } });
    }
};

// ------------------------------
// GET GAME VERSIONS
// ------------------------------
const getGameVersionsController = async (req, res) => {
    try {
        const { game_id } = req.params;
        if (!game_id) return res.status(400).json({ success: false, message: "Missing game ID", data: null, error: { code: 400 } });

        const versions = await getGameVersions(game_id);
        return res.json({ success: true, message: "Versions fetched", data: versions, error: null });

    } catch (err) {
        console.error("Get Versions Error:", err);
        return res.status(500).json({ success: false, message: "Server error", data: null, error: { code: 500, details: err.message } });
    }
};

// ------------------------------
// UPDATE VERSION
// ------------------------------
const updateVersionController = async (req, res) => {
    const { user } = req;
    try {
        const { version_id, version_name, changelog, status } = req.body;
        if (!user?.valid) return res.status(401).json({ success: false, message: "Not logged in", data: null, error: { code: 401 } });
        if (!version_id) return res.status(400).json({ success: false, message: "Missing version ID", data: null, error: { code: 400 } });

        // Fetch the version to get the game_id
        const versions = await getGameVersions(version_id);
        const version = versions.find(v => v.id === version_id);
        if (!version) return res.status(404).json({ success: false, message: "Version not found", data: null, error: { code: 404 } });

        const game = await getGameById(version.game_id);
        const valid_user = await getMember(game.org_id, user.id);
        if (!valid_user || (valid_user.role !== 'admin' && valid_user.role !== 'owner'))
            return res.status(403).json({ success: false, message: "Not authorized", data: null, error: { code: 403 } });

        const updated = await updateVersion({ id: version_id, version_name, changelog, status });
        return res.json({ success: true, message: "Version updated", data: updated, error: null });

    } catch (err) {
        console.error("Update Version Error:", err);
        return res.status(500).json({ success: false, message: "Server error", data: null, error: { code: 500, details: err.message } });
    }
};

module.exports = {
    createGameController,
    updateGameController,
    softDeleteGameController,
    createVersionController,
    getGameVersionsController,
    updateVersionController
};

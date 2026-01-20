const publishingModel = require('../models/publishingModel');
const { slugify } = require('../utils/slugify');
const orgModel = require('../models/organizationModel');
const gameModel = require('../models/gameModel');
const { getMember } = require('../models/organizationMemberModel');

// --- Categories ---
const createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Category name is required" });

    try {
        const slug = slugify(name);
        const category = await publishingModel.createCategory({ name, slug });
        return res.status(201).json({ success: true, message: "Category created", data: category });
    } catch (error) {
        console.error("Create Category Error:", error);
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ success: false, message: "Category with this name or slug already exists." });
        }
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await publishingModel.getAllCategories();
        return res.status(200).json({ success: true, message: "Categories retrieved", data: categories });
    } catch (error) {
        console.error("Get All Categories Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- Articles ---
const createArticle = async (req, res) => {
    const { user } = req;
    const { org_id, game_id, title, summary, body, cover_image_url, category_id, is_published, published_at, is_pinned } = req.body;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!org_id || !title || !body) return res.status(400).json({ success: false, message: "Organization ID, title, and body are required." });

    try {
        const organization = await orgModel.getOrganizationById(org_id);
        if (!organization) return res.status(404).json({ success: false, message: "Organization not found." });

        const member = await getMember(org_id, user.id);
        if (!member || !['admin', 'owner', 'developer'].includes(member.role)) {
            return res.status(403).json({ success: false, message: "Forbidden: Not authorized to publish for this organization." });
        }

        if (game_id) {
            const game = await gameModel.getGameById(game_id);
            if (!game) return res.status(404).json({ success: false, message: "Game not found." });
            if (game.org_id !== org_id) return res.status(400).json({ success: false, message: "Game does not belong to the specified organization." });
        }

        if (category_id) {
            const category = await publishingModel.getCategoryById(category_id); // Assuming this function exists in model
            if (!category) return res.status(404).json({ success: false, message: "Category not found." });
        }
        
        const slug = slugify(title); // Or generate a unique slug if needed
        const article = await publishingModel.createArticle({
            author_id: user.id,
            org_id,
            game_id,
            title,
            slug,
            summary,
            body,
            cover_image_url,
            category_id,
            is_published,
            published_at,
            is_pinned
        });

        // TODO: Trigger notifications if article is published and linked to a game
        
        return res.status(201).json({ success: true, message: "Article created successfully.", data: article });
    } catch (error) {
        console.error("Create Article Error:", error);
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ success: false, message: "An article with this slug already exists for this organization." });
        }
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getArticle = async (req, res) => {
    const { id } = req.params;
    try {
        const article = await publishingModel.getArticleById(id);
        if (!article) return res.status(404).json({ success: false, message: "Article not found." });
        return res.status(200).json({ success: true, message: "Article retrieved.", data: article });
    } catch (error) {
        console.error("Get Article Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getArticlesByOrganization = async (req, res) => {
    const { org_id } = req.params; // Assuming org_id can be passed as param
    try {
        const articles = await publishingModel.getArticlesByOrg(org_id);
        return res.status(200).json({ success: true, message: "Articles retrieved for organization.", data: articles });
    } catch (error) {
        console.error("Get Articles By Organization Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateArticle = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const updates = req.body;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const existingArticle = await publishingModel.getArticleById(id);
        if (!existingArticle) return res.status(404).json({ success: false, message: "Article not found." });

        const organization = await orgModel.getOrganizationById(existingArticle.org_id);
        if (!organization) return res.status(404).json({ success: false, message: "Organization not found for article." });

        const member = await getMember(existingArticle.org_id, user.id);
        if (!member || !['admin', 'owner', 'developer'].includes(member.role)) {
            return res.status(403).json({ success: false, message: "Forbidden: Not authorized to update this article." });
        }

        if (updates.title) updates.slug = slugify(updates.title);

        const updatedArticle = await publishingModel.updateArticle(id, updates);
        return res.status(200).json({ success: true, message: "Article updated successfully.", data: updatedArticle });
    } catch (error) {
        console.error("Update Article Error:", error);
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ success: false, message: "An article with this slug already exists for this organization." });
        }
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteArticle = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const existingArticle = await publishingModel.getArticleById(id);
        if (!existingArticle) return res.status(404).json({ success: false, message: "Article not found." });

        const organization = await orgModel.getOrganizationById(existingArticle.org_id);
        if (!organization) return res.status(404).json({ success: false, message: "Organization not found for article." });

        const member = await getMember(existingArticle.org_id, user.id);
        if (!member || !['admin', 'owner', 'developer'].includes(member.role)) {
            return res.status(403).json({ success: false, message: "Forbidden: Not authorized to delete this article." });
        }

        const rowCount = await publishingModel.deleteArticle(id);
        if (rowCount === 0) return res.status(404).json({ success: false, message: "Article not found or already deleted." });

        return res.status(200).json({ success: true, message: "Article deleted successfully." });
    } catch (error) {
        console.error("Delete Article Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


module.exports = {
    createCategory,
    getAllCategories,
    createArticle,
    getArticle,
    getArticlesByOrganization,
    updateArticle,
    deleteArticle
};
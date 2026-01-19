const crypto = require('crypto');
const communityModel = require('../models/communityModel');
const { getMember } = require('../models/organizationMemberModel'); // Assuming some org-level permissions might be needed
const gameModel = require('../models/gameModel'); // To verify related_game_id if used
const { slugify } = require('../utils/slugify');

// --- Space Controllers ---
const createSpace = async (req, res) => {
    const { user } = req;
    const { related_game_id, name, slug, description } = req.body;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!name || !slug) return res.status(400).json({ success: false, message: "Name and slug are required." });

    let finalSlug = slugify(slug);
    try {
        if (related_game_id) {
            const game = await gameModel.getGameById(related_game_id);
            if (!game) return res.status(404).json({ success: false, message: "Related game not found." });

            // Check if user has permission to create a space for this game's organization
            const member = await getMember(game.org_id, user.id);
            if (!member || !['admin', 'owner', 'developer'].includes(member.role)) {
                return res.status(403).json({ success: false, message: "Forbidden: Not authorized to create space for this game." });
            }
        }

        const space = await communityModel.createSpace({
            creator_id: user.id,
            related_game_id,
            name,
            slug: finalSlug,
            description
        });
        return res.status(201).json({ success: true, message: "Space created successfully.", data: space });
    } catch (error) {
        console.error("Create Space Error:", error);
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ success: false, message: "A space with this slug or related game already exists." });
        }
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getSpace = async (req, res) => {
    const { slug } = req.params;
    try {
        const space = await communityModel.getSpaceBySlug(slug);
        if (!space) return res.status(404).json({ success: false, message: "Space not found." });
        return res.status(200).json({ success: true, message: "Space retrieved.", data: space });
    } catch (error) {
        console.error("Get Space Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const updateSpace = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { name, slug, description } = req.body;
    let finalSlug = slug;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const existingSpace = await communityModel.getSpaceById(id);
        if (!existingSpace) return res.status(404).json({ success: false, message: "Space not found." });

        let authorized = (existingSpace.creator_id === user.id);
        if (existingSpace.related_game_id) {
            const game = await gameModel.getGameById(existingSpace.related_game_id);
            if (game) {
                const member = await getMember(game.org_id, user.id);
                if (member && ['admin', 'owner', 'developer'].includes(member.role)) {
                    authorized = true;
                }
            }
        }
        if (!authorized) return res.status(403).json({ success: false, message: "Forbidden: Not authorized to update this space." });

        if (slug && slugify(slug) !== existingSpace.slug) {
            const baseSlug = slugify(slug);
            let attempts = 0;
            finalSlug = baseSlug;

            while (attempts < 5) {
                const spaceWithSlug = await communityModel.getSpaceBySlug(finalSlug);
                if (!spaceWithSlug) {
                    break;
                }
                const suffix = crypto.randomBytes(3).toString('hex');
                finalSlug = `${baseSlug}-${suffix}`;
                attempts++;
                if (attempts === 5) {
                    return res.status(500).json({ success: false, message: "Failed to create a unique slug after multiple attempts." });
                }
            }
        }

        const updatedSpace = await communityModel.updateSpace(id, { name, slug: finalSlug, description });
        return res.status(200).json({ success: true, message: "Space updated successfully.", data: updatedSpace });
    } catch (error) {
        console.error("Update Space Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const softDeleteSpace = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const existingSpace = await communityModel.getSpaceById(id);
        if (!existingSpace) return res.status(404).json({ success: false, message: "Space not found." });

        // Only creator or org admin/owner/developer if related_game_id is set
        let authorized = (existingSpace.creator_id === user.id);
        if (existingSpace.related_game_id) {
            const game = await gameModel.getGameById(existingSpace.related_game_id);
            if (game) {
                const member = await getMember(game.org_id, user.id);
                if (member && ['admin', 'owner', 'developer'].includes(member.role)) {
                    authorized = true;
                }
            }
        }
        if (!authorized) return res.status(403).json({ success: false, message: "Forbidden: Not authorized to delete this space." });

        await communityModel.softDeleteSpace(id);
        return res.status(200).json({ success: true, message: "Space deleted successfully." });
    } catch (error) {
        console.error("Soft Delete Space Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const undeleteSpace = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const existingSpace = await communityModel.getSpaceById(id, true); // Get even if deleted
        if (!existingSpace) return res.status(404).json({ success: false, message: "Space not found." });

        // Only creator or org admin/owner/developer if related_game_id is set can undelete
        let authorized = (existingSpace.creator_id === user.id);
        if (existingSpace.related_game_id) {
            const game = await gameModel.getGameById(existingSpace.related_game_id);
            if (game) {
                const member = await getMember(game.org_id, user.id);
                if (member && ['admin', 'owner', 'developer'].includes(member.role)) {
                    authorized = true;
                }
            }
        }
        if (!authorized) return res.status(403).json({ success: false, message: "Forbidden: Not authorized to undelete this space." });

        await communityModel.undeleteSpace(id);
        return res.status(200).json({ success: true, message: "Space undeleted successfully." });
    } catch (error) {
        console.error("Undelete Space Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// --- Post Controllers ---
const createPost = async (req, res) => {
    const { user } = req;
    const { space_id, title, body } = req.body;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!space_id || !title) return res.status(400).json({ success: false, message: "Space ID and title are required." });

    try {
        const space = await communityModel.getSpaceById(space_id);
        if (!space) return res.status(404).json({ success: false, message: "Space not found." });

        // Potentially add permissions check: can user post in this space?

        const post = await communityModel.createPost({
            space_id,
            author_id: user.id,
            title,
            body
        });
        return res.status(201).json({ success: true, message: "Post created successfully.", data: post });
    } catch (error) {
        console.error("Create Post Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await communityModel.getPostById(id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found." });
        return res.status(200).json({ success: true, message: "Post retrieved.", data: post });
    } catch (error) {
        console.error("Get Post Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getPostsBySpace = async (req, res) => {
    const { space_slug } = req.params;
    try {
        const space = await communityModel.getSpaceBySlug(space_slug);
        if (!space) return res.status(404).json({ success: false, message: "Space not found." });
        const posts = await communityModel.getPostsBySpace(space.id);
        return res.status(200).json({ success: true, message: "Posts retrieved.", data: posts });
    } catch (error) {
        console.error("Get Posts By Space Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const updatePost = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { title, body } = req.body;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const existingPost = await communityModel.getPostById(id);
        if (!existingPost) return res.status(404).json({ success: false, message: "Post not found." });

        if (existingPost.author_id !== user.id) {
            // Check if user has moderation rights in the space/org
            const space = await communityModel.getSpaceById(existingPost.space_id);
            let authorized = false;
            if (space && space.related_game_id) {
                const game = await gameModel.getGameById(space.related_game_id);
                if (game) {
                    const member = await getMember(game.org_id, user.id);
                    if (member && ['admin', 'owner', 'moderator'].includes(member.role)) {
                        authorized = true;
                    }
                }
            }
            if (!authorized) {
                return res.status(403).json({ success: false, message: "Forbidden: Not authorized to update this post." });
            }
        }

        const updatedPost = await communityModel.updatePost(id, { title, body });
        return res.status(200).json({ success: true, message: "Post updated successfully.", data: updatedPost });
    } catch (error) {
        console.error("Update Post Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const softDeletePost = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const existingPost = await communityModel.getPostById(id);
        if (!existingPost) return res.status(404).json({ success: false, message: "Post not found." });

        if (existingPost.author_id !== user.id) {
            // Check if user has moderation rights in the space/org
            const space = await communityModel.getSpaceById(existingPost.space_id);
            let authorized = false;
            if (space && space.related_game_id) {
                const game = await gameModel.getGameById(space.related_game_id);
                if (game) {
                    const member = await getMember(game.org_id, user.id);
                    if (member && ['admin', 'owner', 'moderator'].includes(member.role)) {
                        authorized = true;
                    }
                }
            }
            if (!authorized) {
                return res.status(403).json({ success: false, message: "Forbidden: Not authorized to delete this post." });
            }
        }

        await communityModel.softDeletePost(id);
        return res.status(200).json({ success: true, message: "Post deleted successfully." });
    } catch (error) {
        console.error("Soft Delete Post Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const undeletePost = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const existingPost = await communityModel.getPostById(id, true); // Get even if deleted
        if (!existingPost) return res.status(404).json({ success: false, message: "Post not found." });

        // Authorization check - only moderators or admins can undelete
        const space = await communityModel.getSpaceById(existingPost.space_id);
        let authorized = false;
        if (space && space.related_game_id) {
            const game = await gameModel.getGameById(space.related_game_id);
            if (game) {
                const member = await getMember(game.org_id, user.id);
                if (member && ['admin', 'owner', 'moderator'].includes(member.role)) {
                    authorized = true;
                }
            }
        }
        if (!authorized) {
            return res.status(403).json({ success: false, message: "Forbidden: Not authorized to undelete this post." });
        }

        await communityModel.undeletePost(id);
        return res.status(200).json({ success: true, message: "Post undeleted successfully." });
    } catch (error) {
        console.error("Undelete Post Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// --- Comment Controllers ---
const createComment = async (req, res) => {
    const { user } = req;
    const { post_id, parent_comment_id, body } = req.body;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!post_id || !body) return res.status(400).json({ success: false, message: "Post ID and body are required." });

    try {
        const post = await communityModel.getPostById(post_id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found." });

        if (parent_comment_id) {
            const parentComment = await communityModel.getCommentById(parent_comment_id);
            if (!parentComment) return res.status(404).json({ success: false, message: "Parent comment not found." });
        }

        const comment = await communityModel.createComment({
            post_id,
            author_id: user.id,
            parent_comment_id,
            body
        });
        return res.status(201).json({ success: true, message: "Comment created successfully.", data: comment });
    } catch (error) {
        console.error("Create Comment Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getComment = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await communityModel.getCommentById(id);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found." });
        return res.status(200).json({ success: true, message: "Comment retrieved.", data: comment });
    } catch (error) {
        console.error("Get Comment Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getCommentsByPost = async (req, res) => {
    const { post_id } = req.params;
    try {
        const comments = await communityModel.getCommentsByPost(post_id);
        return res.status(200).json({ success: true, message: "Comments retrieved.", data: comments });
    } catch (error) {
        console.error("Get Comments By Post Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const updateComment = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { body } = req.body;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const existingComment = await communityModel.getCommentById(id);
        if (!existingComment) return res.status(404).json({ success: false, message: "Comment not found." });

        if (existingComment.author_id !== user.id) {
            // Potentially add moderation rights check
            return res.status(403).json({ success: false, message: "Forbidden: Not authorized to update this comment." });
        }

        const updatedComment = await communityModel.updateComment(id, { body });
        return res.status(200).json({ success: true, message: "Comment updated successfully.", data: updatedComment });
    } catch (error) {
        console.error("Update Comment Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const softDeleteComment = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const existingComment = await communityModel.getCommentById(id);
        if (!existingComment) return res.status(404).json({ success: false, message: "Comment not found." });

        if (existingComment.author_id !== user.id) {
            // Potentially add moderation rights check
            return res.status(403).json({ success: false, message: "Forbidden: Not authorized to delete this comment." });
        }

        // The model function should handle recursive deletion of sub-comments
        await communityModel.softDeleteComment(id);
        return res.status(200).json({ success: true, message: "Comment and its replies deleted successfully." });
    } catch (error) {
        console.error("Soft Delete Comment Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const undeleteComment = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const existingComment = await communityModel.getCommentById(id, true); // Get even if deleted
        if (!existingComment) return res.status(404).json({ success: false, message: "Comment not found." });

        // Authorization check - assuming only moderators or admins can undelete
        const post = await communityModel.getPostById(existingComment.post_id);
        const space = await communityModel.getSpaceById(post.space_id);
        let authorized = false;
        if (space && space.related_game_id) {
            const game = await gameModel.getGameById(space.related_game_id);
            if (game) {
                const member = await getMember(game.org_id, user.id);
                if (member && ['admin', 'owner', 'moderator'].includes(member.role)) {
                    authorized = true;
                }
            }
        }
        if (!authorized) {
            return res.status(403).json({ success: false, message: "Forbidden: Not authorized to undelete this comment." });
        }

        await communityModel.undeleteComment(id);
        return res.status(200).json({ success: true, message: "Comment undeleted successfully." });
    } catch (error) {
        console.error("Undelete Comment Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// --- Post Vote Controllers ---
const addPostVote = async (req, res) => {
    const { user } = req;
    const { post_id } = req.params;
    const { value } = req.body; // value should be 1 for upvote, -1 for downvote

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!post_id || ![-1, 1].includes(value)) return res.status(400).json({ success: false, message: "Post ID and a valid vote value (1 or -1) are required." });

    try {
        const post = await communityModel.getPostById(post_id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found." });

        // Prevent self-voting
        if (post.author_id === user.id) {
            return res.status(403).json({ success: false, message: "Forbidden: Cannot vote on your own post." });
        }

        const vote = await communityModel.addPostVote({ post_id, user_id: user.id, value });
        return res.status(201).json({ success: true, message: "Vote added/updated successfully.", data: vote });
    } catch (error) {
        console.error("Add Post Vote Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const removePostVote = async (req, res) => {
    const { user } = req;
    const { post_id } = req.params;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!post_id) return res.status(400).json({ success: false, message: "Post ID is required." });

    try {
        const rowsAffected = await communityModel.removePostVote(post_id, user.id);
        if (rowsAffected === 0) {
            return res.status(404).json({ success: false, message: "Vote not found or already removed." });
        }
        return res.status(200).json({ success: true, message: "Vote removed successfully." });
    } catch (error) {
        console.error("Remove Post Vote Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// --- Comment Vote Controllers ---
const addCommentVote = async (req, res) => {
    const { user } = req;
    const { comment_id } = req.params;
    const { value } = req.body;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!comment_id || ![-1, 1].includes(value)) return res.status(400).json({ success: false, message: "Comment ID and a valid vote value (1 or -1) are required." });

    try {
        const comment = await communityModel.getCommentById(comment_id);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found." });

        if (comment.author_id === user.id) {
            return res.status(403).json({ success: false, message: "Forbidden: Cannot vote on your own comment." });
        }

        const vote = await communityModel.addCommentVote({ comment_id, user_id: user.id, value });
        return res.status(201).json({ success: true, message: "Vote added/updated successfully.", data: vote });
    } catch (error) {
        console.error("Add Comment Vote Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const removeCommentVote = async (req, res) => {
    const { user } = req;
    const { comment_id } = req.params;

    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!comment_id) return res.status(400).json({ success: false, message: "Comment ID is required." });

    try {
        const rowsAffected = await communityModel.removeCommentVote(comment_id, user.id);
        if (rowsAffected === 0) {
            return res.status(404).json({ success: false, message: "Vote not found or already removed." });
        }
        return res.status(200).json({ success: true, message: "Vote removed successfully." });
    } catch (error) {
        console.error("Remove Comment Vote Error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = {
    createSpace,
    getSpace,
    updateSpace,
    softDeleteSpace,
    undeleteSpace,
    createPost,
    getPost,
    getPostsBySpace,
    updatePost,
    softDeletePost,
    undeletePost,
    createComment,
    getComment,
    getCommentsByPost,
    updateComment,
    softDeleteComment,
    undeleteComment,
    addPostVote,
    removePostVote,
    addCommentVote,
    removeCommentVote
};
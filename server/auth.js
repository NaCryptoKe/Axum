const express = require("express");
const jwt = require("jsonwebtoken");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const router = express.Router();

// 🔧 Google OAuth Strategy setup


// 🧭 Start Google login



// 🔙 Google callback route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }),
    (req, res) => {
        const user = req.user;

        if (!user) {
            return res.status(400).json({ message: "No user found from Google" });
        }

        // 🎟️ Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || "super_secret_long_random_string",
            { expiresIn: "1d" }
        );

        // 🍪 Send token cookie (optional for testing)
        res.cookie("token", token, {
            httpOnly: false,
            secure: false, // true in production
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        // 🧃 Respond with JSON instead of redirect
        return res.status(200).json({
            message: "Google OAuth successful",
            token,
            user: {
                username: user.username,
                email: user.email,
                display_name: user.username,
                avatar_url: user.avatar_url,
            },
        });
    }
);


module.exports = router;

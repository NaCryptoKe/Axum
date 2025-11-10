const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { findByIdentifier, createUser, getUserByUsername } = require('../models/userModel');
const {createSession, getAllUsersSession, deleteSession} = require('../models/sessionModel');

/**
 * Configuration options for Argon2 password hashing.
 *
 * @constant {Object} ARGON2_OPTS
 * @property {number} type - Argon2 variant to use (argon2id recommended for security).
 * @property {number} memoryCost - Memory usage in KiB (2^16 = 65536 KiB).
 * @property {number} timeCost - Number of iterations to apply (hashing rounds).
 * @property {number} parallelism - Number of parallel threads for hashing.
 */
const ARGON2_OPTS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1
};


//OAuth setup
/**
 * Sets up Google OAuth 2.0 authentication strategy using Passport.js.
 *
 * Uses `passport-google-oauth20` to authenticate users via Google and handle
 * user profile retrieval. On successful authentication, maps the profile data
 * to a user object and passes it to Passport's `done` callback.
 *
 * @constant {GoogleStrategy} GoogleStrategy - Passport strategy instance.
 *
 * @param {string} clientID - Google OAuth client ID.
 * @param {string} clientSecret - Google OAuth client secret.
 * @param {string} callbackURL - URL Google redirects to after authentication.
 * @param {function} verify - Async function called after Google authenticates the user.
 *   @param {string} accessToken - OAuth access token.
 *   @param {string} refreshToken - OAuth refresh token.
 *   @param {Object} profile - Google profile object containing user info.
 *   @param {function} done - Passport callback to signal success or failure.
 *
 * @returns {Object} user - User object containing:
 *   - id {number} - Example user ID (replace with real DB logic)
 *   - username {string} - Derived from displayName or email prefix
 *   - email {string} - User's email from Google profile
 *   - role {string} - Default user role
 *   - avatar_url {string} - URL of user's Google profile picture
 */
passport.use(
    new GoogleStrategy(
        {
            clientID: "736040441877-i5bn5cptbctkd04dkc4a223j690q98uu.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3000/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.toLowerCase();
                const username = profile.displayName || email.split("@")[0];
                const avatar_url = profile.photos?.[0]?.value;

                // 👇 Replace with real DB check/create logic
                const user = {
                    id: 1,
                    username,
                    email,
                    role: "user",
                    avatar_url
                };

                return done(null, user);
            } catch (err) {
                console.error("OAuth Error:", err);
                done(err, null);
            }
        }
    )
);

/**
 * Health Check
 */
const healthCheck = (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'The authentication route is running!',
        data: null,
        error: null
    });
};

/**
 * Normal Authentication
 */
/**
 * Handles user login by validating credentials, verifying the password,
 * creating a session, generating a JWT, and setting it as a cookie.
 *
 * @async
 * @function login
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request payload containing login details.
 * @param {string} req.body.identifier - Username or email for login.
 * @param {string} req.body.password - User's password.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response with possible outcomes:
 *
 * Success (200):
 * {
 *   success: true,
 *   message: "Successfully logged in",
 *   data: {
 *     token: string, // JWT token
 *     user: {
 *       id: string,
 *       name: string
 *     }
 *   },
 *   error: null
 * }
 *
 * Client errors (400) include:
 *  - Missing credentials
 *  - Nonexistent user
 *  - Incorrect password
 *
 * Server errors (500) include:
 * {
 *   success: false,
 *   message: "Invalid Login",
 *   data: null,
 *   error: { code: 500, details: string }
 * }
 *
 * Notes:
 * - Passwords are verified using Argon2 hashing.
 * - JWT contains user ID, username, role, and session ID.
 * - Login session is stored in the database.
 * - Token is sent to the client as an HTTP-only cookie with a 30-day expiry.
 */
const login = async (req, res) => {
    try {
        let { identifier } = req.body;
        const { password } = req.body;

        if (!identifier || !password)
            return res.status(400).json({
                success: false,
                message: "Missing Credentials",
                data: null,
                error: {
                    code: 400,
                    details: 'Missing Credentials'
                }
            });

        identifier = identifier.toLowerCase().trim();

        const user = await findByIdentifier(identifier);

        if (!user)
            return res.status(400).json({
                success: false,
                message: "Invalid username or email",
                data: null,
                error: {
                    code: 400,
                    details: 'User does not exist'
                }
            });

        const passwordMatches = await argon2.verify(user.hashed_password, password);
        if (!passwordMatches)
            return res.status(400).json({
                success: false,
                message: "Incorrect Password",
                data: null,
                error: {
                    code: 400,
                    details: `The correct password wasn't entered.`
                }
            });

        // JWT expiration
        const tokenExpiry = '30d';
        const cookieMaxAge = 30 * 24 * 60 * 60 * 1000 ; // A month long (30 days)

        // Store session in DB
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const expiresAt = new Date(Date.now() + cookieMaxAge);

        const session = await createSession(user.id, userAgent, ipAddress, expiresAt);

        // Sign JWT (Token)
        const tokenPayload = { id: user.id, username: user.username, role: user.role, sessionId: session.id }; // What the token holds
        const token = jwt.sign(tokenPayload,  process.env.SECRET_STRING || 'super_secret_long_random_string', {
            algorithm: 'HS256',
            expiresIn: tokenExpiry,
        }); // Encrypting the token

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: cookieMaxAge
        });

        return res.status(200).json({
            success: true,
            message: "Successfully logged in",
            data: {
                token: token,
                user: {
                    id: user.id,
                    name: user.username,
                }
            },
            error: null
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(400).json({
            success: false,
            message: "Invalid Login",
            data: null,
            error: {
                code: 500,
                details: err.message
            }
        });
    }
};

/**
 * Handles user registration by validating input, checking for duplicates,
 * hashing the password, and creating a new user in the system.
 *
 * @async
 * @function register
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request payload containing user details.
 * @param {string} req.body.username - Desired username (alphanumeric + underscores, min 4 chars).
 * @param {string} req.body.email - User's email address (must be valid format).
 * @param {string} req.body.firstname - User's first name.
 * @param {string} req.body.lastname - User's last name.
 * @param {string} req.body.password - User's password (min 8 chars, includes uppercase, lowercase, number, special character).
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response with the following possible outcomes:
 *
 * Success (201):
 *  {
 *    success: true,
 *    message: "Successfully created user",
 *    data: {
 *      id: string,
 *      username: string,
 *      email: string,
 *      hashedPassword: string,
 *      firstname: string,
 *      lastname: string
 *    },
 *    error: null
 *  }
 *
 * Client errors (400, 409) include a descriptive message and error details:
 *  - Missing fields
 *  - Invalid email format
 *  - Invalid username format
 *  - Invalid password (length, missing uppercase/lowercase/number/special char)
 *  - Duplicate username or email
 *
 * Server errors (500) return:
 *  {
 *    success: false,
 *    message: "Server error",
 *    data: null,
 *    error: { code: 500, details: string }
 *  }
 */
const register = async (req, res) => {
    let { username, email, firstname, lastname } = req.body;
    const { password } = req.body;
    const unprocessableErrors = [];
    const conflictErrors = [];
    const badRequestErrors = [];

    try {
        if (!firstname || !lastname || !username || !email || !password) badRequestErrors.push ('Missing Credentials')

        if (badRequestErrors.length > 0)
            return res.status(400).json({
                success: false,
                message: "Bad Request",
                data: null,
                error: {
                    code: 400,
                    details: badRequestErrors
                }
            });


        username = username.toLowerCase().trim();
        email = email.toLowerCase().trim();
        firstname = (firstname[0].toUpperCase() + firstname.slice(1).toLowerCase()).trim();
        lastname = (lastname[0].toUpperCase() + lastname.slice(1).toLowerCase()).trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) unprocessableErrors.push('Email addresses should follow, example@example.com')



        if (!/^[A-Za-z0-9_]{4,}$/.test(username)) unprocessableErrors.push('Usernames can only have alphanumeric characters and underscores.');

        if (password.length < 8) unprocessableErrors.push ('Password length should be at least 8 characters.');

        if (!/[A-Z]/.test(password)) unprocessableErrors.push ('Password should contain a capital letter.');

        if (!/[a-z]/.test(password)) unprocessableErrors.push('Password should contain a small letter.');

        if (!/[^a-zA-Z0-9]/.test(password)) unprocessableErrors.push ('Password should contain a special character.');

        if (!/\d/.test(password)) unprocessableErrors.push ('Password should contain a number.');

        if (unprocessableErrors.length > 0)
            return res.status(422).json({
                success: false,
                message: "Unprocessable inputs",
                data: null,
                error: {
                    code: 422,
                    details: unprocessableErrors
                }
            });

        const existingUsername = await findByIdentifier(username);
        const existingUserEmail = await findByIdentifier(email);

        if (existingUsername) conflictErrors.push ('The username has already been taken.');

        if (existingUserEmail) conflictErrors.push ('The email has already been taken.');

        if (conflictErrors.length > 0)
            return res.status(409).json({
                success: false,
                message: "Email address or username is taken",
                data: null,
                error: {
                    code: 409,
                    details: conflictErrors
                }
            });

        const hashedPassword = await argon2.hash(password, ARGON2_OPTS);

        const newUser = await createUser({ username, email, hashedPassword });

        return res.status(201).json({
            success: true,
            message: "Successfully created user",
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                hashedPassword: hashedPassword,
                firstname: firstname,
                lastname: lastname,
            },
            error: null
        });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: null,
            error: {
                code: 500,
                details: err.message
            }
        });
    }
};

/**
 * AUTH UTILITIES
 */
/**
 * Verifies user authentication by validating a JWT token from cookies or headers.
 *
 * @function authenticate
 * @param {Object} req - Express request object.
 * @param {Object} req.cookies - Cookies sent by the client.
 * @param {Object} req.headers - Request headers, may contain 'Authorization'.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response with possible outcomes:
 *
 * Success (200):
 * {
 *   success: true,
 *   message: 'Authenticated with JWT token',
 *   data: {
 *     id: string,          // User ID from token
 *     username: string,    // Username from token
 *     sessionId: string    // Session ID from token
 *   },
 *   error: null
 * }
 *
 * Client errors (401):
 * {
 *   success: false,
 *   message: 'Token not found',
 *   data: null,
 *   error: { code: 401, details: 'Token not found' }
 * }
 *
 * Server errors (500):
 * {
 *   success: false,
 *   message: 'Server error',
 *   data: null,
 *   error: { code: 500, details: string }
 * }
 *
 * Notes:
 * - JWT is verified using a secret key.
 * - Token is read first from cookies, then from the Authorization header.
 */
const authenticate = (req, res, next) => {
    try {
        // Try reading token from cookie first, fallback to header
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1]; // Checks token existence and authorization header
        if (!token) return res.status(401).json({
            success: false,
            message: "Token not found",
            data: null,
            error: {
                code: 401,
                details: 'Token not found'
            }
        });

        // Verify JWT
        const decoded = jwt.verify(token,  'super_secret_long_random_string');

        return res.json({
            success: true,
            message: 'Authenticated with JWT token',
            data: {
                id: decoded.id,
                username: decoded.username,
                sessionId: decoded.sessionId,
            },
            error: null });
    } catch (err) {
        console.error('Token validation error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: null,
            error: {
                code: 500,
                details: err.message
            }
        });
    }
};
const authenticateMiddleware = (req, res, next) => {
    try {
        // Try reading token from cookie first, fallback to header
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1]; // Checks token existence and authorization header
        if (!token) return res.status(401).json({
            success: false,
            message: "Token not found",
            data: null,
            error: {
                code: 401,
                details: 'Token not found'
            }
        });

        // Verify JWT
        const decoded = jwt.verify(token,  'super_secret_long_random_string');

        req.user = {
            id: decoded.id,
            username: decoded.username,
            sessionId: decoded.sessionId,
        };

        next();
    } catch (err) {
        console.error('Token validation error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: null,
            error: {
                code: 500,
                details: err.message
            }
        });
    }
};

/**
 * SESSIONS
 */
/**
 * Retrieves all active sessions for the currently authenticated user.
 *
 * @async
 * @function getAllUsersSessions
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user object containing the user ID.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response with possible outcomes:
 *
 * Success (200):
 * {
 *   success: true,
 *   message: "All sessions found",
 *   data: {
 *     "All Sessions": [
 *       {
 *         session_id: string,
 *         ip_address: string,
 *         device: string,
 *         created_at: string,
 *         last_seen_at: string | null
 *       }
 *     ]
 *   },
 *   error: null
 * }
 *
 * Client errors (404):
 * {
 *   success: false,
 *   message: "No sessions found",
 *   data: null,
 *   error: { code: 404, details: "No sessions found" }
 * }
 *
 * Server errors (500):
 * {
 *   success: false,
 *   message: "Server error",
 *   data: null,
 *   error: { code: 500, details: string }
 * }
 *
 * Notes:
 * - Fetches sessions from the database using the authenticated user's ID.
 * - Each session object is cleaned and formatted before being returned.
 * - Includes optional `last_seen_at` if tracked in the session data.
 */
const getAllUsersSessions = async (req, res) => {
    const { id } = await req.user;

    try {
        const sessions = await getAllUsersSession(id);

        if (!sessions || sessions.length === 0)
            return res.status(404).json({
                success: false,
                message: "No sessions found",
                data: null,
                error: {
                    code: 404,
                    details: "No sessions found"
                }
            });

        // Map each session to a cleaner JSON format
        const formattedSessions = sessions.map(session => ({
            session_id: session.id,
            ip_address: session.ip_address,
            device: session.device,
            created_at: session.created_at,
            last_seen_at: session.last_seen_at || null, // optional if you track last activity
        }));

        return res.status(200).json({
            success: true,
            message: "All sessions found",
            data: {
                "All Sessions":formattedSessions
            },
            error: null
        });
    } catch (error) {
        console.error("Get All User Sessions Error:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: null,
            error: {
                code: 500,
                details: error.message
            }
        });
    }
};
/**
 * Deletes (revokes) a specific user session by its session ID.
 *
 * @async
 * @function deleteUserSession
 * @param {Object} req - Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.session_id - The ID of the session to delete.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response with possible outcomes:
 *
 * Success (204):
 * {
 *   success: true,
 *   message: "Session Revoked Successfully",
 *   data: null,
 *   error: null
 * }
 *
 * Client errors (404):
 * {
 *   success: false,
 *   message: "No sessions found",
 *   data: null,
 *   error: { code: 404, details: "No session found" }
 * }
 *
 * Server errors (500):
 * {
 *   success: false,
 *   message: "Server error",
 *   data: null,
 *   error: { code: 500, details: string }
 * }
 *
 * Notes:
 * - Requires a valid `session_id` parameter.
 * - Uses `deleteSession()` to remove the session record from the database.
 * - Returns 204 (No Content) on successful deletion.
 */
const deleteUserSession = async (req, res) => {
    const { session_id } = req.params;
    const { sessionId } = req.user;

    try {
        if (!session_id) return res.status(404).json({
            success: false,
            message: "No sessions found",
            data: null,
            error: {
                code: 404,
                details: 'No session found'
            }
        });

        const result = await deleteSession(session_id);

        if (!result || result.length === 0) return res.status(404).json({
            success: false,
            message: "No sessions found",
            data: null,
            error: {
                code: 404,
                details: 'No session found'
            }
        });

        return res.status(204).json({
            success: true,
            message: "Session Revoked Successfully",
            data: null,
            error: null
        })

    } catch (error) {
        console.error("Get All User Sessions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            data: null,
            error: {
                code: 500,
                details: error.message
            }
        });
    }
};


// ======================
// GOOGLE OAUTH
// ======================
const google = passport.authenticate("google", { scope: ["profile", "email"] });

const googleCallback = (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, profile) => {
        if (err || !profile) {
            console.error("Google OAuth error:", err);
            return res.status(400).json({ message: "OAuth failed or no user found" });
        }

        try {
            const email = profile.emails?.[0]?.value?.toLowerCase();
            const displayName = profile.displayName || "New User";
            if (!email) return res.status(400).json({ message: "Google account has no email" });

            // ✅ Check if user exists
            let user = await findByIdentifier(email);
            let message;

            if (!user) {
                user = await createUser({
                    username: displayName.toLowerCase().replace(/\s+/g, "_"),
                    email,
                    display_name: displayName,
                    hashed_password: null,
                    avatar_url: profile.photos?.[0]?.value || null
                });
                message = "Hello new user 👋";
            } else {
                message = "Welcome back 👀";
            }

            // ✅ Create session for online tracking
            const userAgent = req.headers["user-agent"];
            const ipAddress = req.ip;
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 1 day by default
            const session = await createSession(user.id, userAgent, ipAddress, expiresAt);

            // ✅ Generate JWT including sessionId
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role, sessionId: session.id },
                "super_secret_long_random_string",
                { expiresIn: "1d" }
            );

            // ✅ Set cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                message,
                token,
                user: {
                    username: user.username,
                    email: user.email,
                    display_name: user.display_name,
                    avatar_url: user.avatar_url
                }
            });
        } catch (dbErr) {
            console.error("DB error in Google OAuth:", dbErr);
            return res.status(500).json({ message: "Server error during OAuth" });
        }
    })(req, res, next);
};

/**
 * Handles user logout by deleting the current session from the database
 * and clearing the authentication token cookie.
 *
 * @async
 * @function logout
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user object from middleware.
 * @param {string} req.user.sessionId - The ID of the session to be deleted.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response with possible outcomes:
 *
 * Success (200):
 * {
 * success: true,
 * message: "Successfully logged out",
 * data: null,
 * error: null
 * }
 *
 * Server Error (500):
 * {
 * success: false,
 * message: "Server error during logout",
 * ...
 * }
 */
const logout = async (req, res) => {
    try {
        // The sessionId is attached to req.user by the authenticateMiddleware
        const { sessionId } = req.user;

        if (sessionId) {
            // 1. Delete the session from the database
            await deleteSession(sessionId);
        }

        // 2. Clear the cookie
        // IMPORTANT: These options MUST match the options used when setting the cookie in login()
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });

        return res.status(200).json({
            success: true,
            message: "Successfully logged out",
            data: null,
            error: null
        });

    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
            success: false,
            message: 'Server error during logout',
            data: null,
            error: {
                code: 500,
                details: err.message
            }
        });
    }
};

module.exports = {
    login,
    register,
    authenticate,
    google,
    googleCallback,
    getAllUsersSessions,
    deleteUserSession,
    healthCheck,
    authenticateMiddleware,
    logout,
};

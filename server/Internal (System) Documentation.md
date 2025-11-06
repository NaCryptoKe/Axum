# 🧩 API Documentation

**Base URL:**  
`http://localhost:3000/api/`

This API provides endpoints for **authentication**, **password management**, and **user operations**.  
All endpoints are versionless and start with `/api/` for simplicity.

---

## 🏠 Root Endpoint

### `GET /`
**Purpose:** Confirm the server is running.  
**Request:** None  
**Response:**
```text
Welcome to the server!
```

---

## 🔐 Authentication Routes
### GET /auth

Health check for the authentication router.
**Response**:
```text
API AUTH
```

### GET /auth/google
**Purpose**: Initiates Google OAuth 2.0 authentication.
**Request**: None
**Response**: Redirects to Google’s login page.

### GET /auth/google/callback

**Purpose**: Handles Google OAuth redirect.
**Request**: Google OAuth redirect parameters.
**Response**:
```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN_IN_COOKIE",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string"
  }
}
```

### POST /auth/login

**Purpose**: Authenticate using email/username + password.
**Request**:
```json
{
  "identifier": "email_or_username",
  "password": "string"
}
```

**Response**:
```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN_IN_COOKIE",
  "user": { ... }
}
```

### POST /auth/register

**Purpose**: Register a new user.
**Request**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "display_name": "string"
}
```

**Response**:
```json
{
  "message": "User registered successfully",
  "token": "JWT_TOKEN_IN_COOKIE",
  "user": { ... }
}
```

### GET /auth/authenticate

**Purpose**: Validate a user’s JWT session.
**Request**: JWT token in cookies.
**Response**:
```json
{
  "authenticated": true,
  "user": { ... }
}
```

### POST /auth/generate_otp

**Purpose**: Generate a one-time password (OTP) and email it to the user.
**Request**:
```json
{
  "user_id": "uuid"
}
```
**Response (201)**:
```json
{
  "message": "OTP generated successfully",
  "expires_at": "timestamp",
  "otp": "123456"
}
```

### POST /auth/verify_otp

**Purpose**: Verify a user’s OTP for email confirmation.
**Request**:
```json
{
  "user_id": "uuid",
  "otp": "string"
}
```
**Response**:
```json
{
  "success": true,
  "user": { ... }
}
```

### POST /auth/logout

**Purpose**: Logout user by clearing JWT cookie.
**Response**:
```json
{
  "message": "Logged out successfully"
}
```

---

## 🔑 Password Reset Routes

### GET /passwordReset

Health check for password reset router.
**Response**:
```text
Password Reset
```

### POST /passwordReset/generate_password_reset

**Purpose**: Generate a password reset token and email notification.
**Request**:
```json
{
  "user_id": "uuid"
}
```
**Response (201)**:
```json
{
  "message": "Password reset token generated successfully"
}
```

### POST /passwordReset/verify_password_reset

**Purpose**: Verify password reset token validity.
**Request**:
```json
{
  "token": "string"
}
```
**Response**:
```json
{
  "valid": true,
  "user_id": "uuid"
}
```
### POST /passwordReset/update_password

**Purpose**: Update password using a valid reset token.
**Request**:
```json
{
  "token": "string",
  "newPassword": "string"
}
```
**Response**:
```json
{
  "message": "Password updated successfully"
}
```

--- 

## 👤 User Routes

### GET /

Health check for user router.
**Response**:
```text
USER WORKING
```

### GET /@:username

**Purpose**: Retrieve user profile by username.
**Request**: :username (URL parameter)
**Response**:
```json
{
  "username": "string",
  "display_name": "string",
  "email": "string",
  "bio": "string",
  "avatar_url": "string"
}
```

### GET /@:username/status

**Purpose**: Get online status and last seen timestamp.

**Request**: :username (URL parameter)

**Response**:
```json
{
  "username": "string",
  "online": true,
  "lastSeenAt": "timestamp"
}
```

### GET /users

**Purpose**: Retrieve all users.

**Response**:
```json
[
  { "id": "uuid", "username": "string", "email": "string", ... },
  ...
]
```

### GET /users/active

**Purpose**: Retrieve all currently active/online users.

**Response**:
```json
[
  { "id": "uuid", "username": "string", ... },
  ...
]
```
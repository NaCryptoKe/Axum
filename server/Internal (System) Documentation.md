# 🧩 API Documentation

**Base URL:**  
`http://localhost:3000/api/`

This API provides endpoints for **authentication**, **password management**, and **user operations**.  
All endpoints are versionless and start with `/api/` for simplicity.

---

## Universal Response

```json
[{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "uuid",
      "username": "nahom",
      "email": "nahom@example.com"
    }
  },
  "error": null
},
{
  "success": false,
  "message": "Invalid credentials",
  "data": null,
  "error": {
    "code": "INVALID_LOGIN",
    "details": "Password does not match"
  }
}]
```

| Field     | Purpose                                                          |
| --------- | ---------------------------------------------------------------- |
| `success` | Always a boolean. Frontends check this first.                    |
| `message` | Short, human-readable summary of what happened.                  |
| `data`    | Contains any returned objects (user, token, etc). Null on error. |
| `error`   | Contains machine-readable info for debugging. Null on success.   |
---

## Status Codes

### Success Codes

| Code               | Meaning                                                             | When to Use                                        | Example                                |
| ------------------ | ------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------- |
| **200 OK**         | Successful GET, PUT, DELETE, or POST that doesn’t create a resource | Login, logout, data retrieval, updates, deletions  | ✅ Login successful                     |
| **201 Created**    | A new resource was successfully created                             | User registration, game upload, new community post | ✅ User registered successfully         |
| **202 Accepted**   | Request accepted for processing, but not yet complete               | Async tasks, queued uploads, AI processing         | ⚙️ “Game analytics is being generated” |
| **204 No Content** | Success with no response body                                       | When deleting a session or clearing data           | ✅ Session revoked successfully         |


### Client Error Codes
| Code                         | Meaning                                      | When to Use                                        | Example                               |
| ---------------------------- | -------------------------------------------- | -------------------------------------------------- | ------------------------------------- |
| **400 Bad Request**          | Invalid input, missing fields, or bad format | Missing credentials, malformed JSON, weak password | ❌ Missing credentials                 |
| **401 Unauthorized**         | User not logged in or token invalid          | Invalid JWT, missing cookie, wrong password        | ❌ Token expired or missing            |
| **403 Forbidden**            | Authenticated, but not allowed               | Accessing admin route as user                      | ❌ Access denied                       |
| **404 Not Found**            | Resource doesn’t exist                       | Invalid username, nonexistent game/post            | ❌ User not found                      |
| **405 Method Not Allowed**   | Wrong HTTP method                            | POST to a GET-only endpoint                        | ❌ Use GET instead                     |
| **409 Conflict**             | Resource already exists                      | Duplicate username/email, re-upload of same game   | ❌ Email already in use                |
| **422 Unprocessable Entity** | Data format is correct but validation fails  | Password doesn’t meet strength requirements        | ❌ Weak password                       |
| **429 Too Many Requests**    | Rate limit triggered                         | Multiple failed logins                             | ⚠️ Too many login attempts, try later |

### Server Error Codes

| Code                          | Meaning                                             | When to Use                               | Example                      |
| ----------------------------- | --------------------------------------------------- | ----------------------------------------- | ---------------------------- |
| **500 Internal Server Error** | Unexpected server failure                           | Database down, uncaught exceptions        | ❌ Server error during login  |
| **502 Bad Gateway**           | Upstream service (API, DB) failed                   | Payment gateway unreachable               | ⚠️ Chapa API failure         |
| **503 Service Unavailable**   | Service temporarily overloaded or under maintenance | Rate limiting global                      | ⚠️ Server maintenance        |
| **504 Gateway Timeout**       | External API took too long                          | Third-party call timeout (e.g. Gemini AI) | ⚠️ AI support not responding |


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

### Authentication Health Check

**Purpose**:

Verify that the authentication router is running and accessible. 

Useful for monitoring or initial connectivity checks.

**Request**:

- Method: `GET`
- URL: `/auth`
- Headers: None Required
- Body: None

**Response**:
```json
{
  "success": true,
  "message": "The authentication route is running!",
  "data": null,
  "error": null
}
```

### Register User

**Purpose**: 

Create a new user account with validated credentials. 

Ensures unique username and email, enforces strong password rules, and standardizes name formatting.

**Request**:

- Method: `POST`
- URL: `/auth/register`
- Headers: `Content-Type: application/json`
- Body:

```json
 {
    "username": "string (alphanumeric, min 4 characters, underscores allowed)",
    "email": "string (valid email format, example@example.com)",
    "firstname": "string",
    "lastname": "string",
    "password": "string (min 8 chars, includes uppercase, lowercase, number, special char)"
 }
```

**Response**:

1. ***Success*** (201 Created)
```json
{
  "success": true,
  "message": "Successfully created user",
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "hashedPassword": "string",
    "firstname": "string (sentence case)",
    "lastname": "string (sentence case)"
  },
  "error": null
}
```

2. ***Client Errors*** (400 Bad Request):

- Missing Credentials:
```json
{
  "success": false,
  "message": "Missing Credentials",
  "data": null,
  "error": { "code": 400, "details": "Missing Credentials" }
}
```
- Invalid Email:
```json
{
  "success": false,
  "message": "Invalid Email address",
  "data": null,
  "error": { "code": 400, "details": "Email addresses should follow, example@example.com" }
}
```
- Invalid Password (multiple cases):
  - Too short:
```json
{
  "success": false,
  "message": "Invalid Password",
  "data": null,
  "error": { "code": 400, "details": "Password length should be at least 8 characters." }
}
```
  - Missing uppercase:
```json
{
  "success": false,
  "message": "Invalid Password",
  "data": null,
  "error": { "code": 400, "details": "Password should contain a capital letter." }
}
```
  - Missing lowercase:
```json
{
  "success": false,
  "message": "Invalid Password",
  "data": null,
  "error": { "code": 400, "details": "Password should contain a small letter." }
}
```
  - Missing special character:
```json
{
  "success": false,
  "message": "Invalid Password",
  "data": null,
  "error": { "code": 400, "details": "Password should contain a special character." }
}
```
  - Missing number:
```json
{
  "success": false,
  "message": "Invalid Password",
  "data": null,
  "error": { "code": 400, "details": "Password should contain a number." }
}
```

3. ***Conflict Errors*** (409 Conflict):

- Username exists:
```json
{
  "success": false,
  "message": "Username already exist",
  "data": null,
  "error": { "code": 409, "details": "The username has already been taken." }
}
```
- Email exists:
```json
{
  "success": false,
  "message": "Email already exist",
  "data": null,
  "error": { "code": 409, "details": "The email has already been taken." }
}
```

4. ***Server Error*** (500 Internal Server Error):
```json
{
  "success": false,
  "message": "Server error",
  "data": null,
  "error": { "code": 500, "details": "Error message from server" }
}
```

---

### Login User

**Purpose**:

Authenticate a user with a username or email and password. 

Creates a session, issues a JWT token, and sets it as an HTTP-only cookie for secure client authentication.

**Request**:

- Method: `POST`
- URL: `/auth/login`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "identifier": "string (username or email)",
  "password": "string"
}
```

**Response**:
1. Success (200 OK):

```json
{
  "success": true,
  "message": "Successfully logged in",
  "data": {
    "token": "JWT token string",
    "user": {
      "id": "string",
      "name": "string (username)"
    }
  },
  "error": null
}
```

2. Client Errors (400 Bad Request):

- Missing Credentials:
```json
{
  "success": false,
  "message": "Missing Credentials",
  "data": null,
  "error": { "code": 400, "details": "Missing Credentials" }
}
```
- Invalid Username or Email:
```json
{
  "success": false,
  "message": "Invalid username or email",
  "data": null,
  "error": { "code": 400, "details": "User does not exist" }
}
```
- Incorrect Password:
```json
{
  "success": false,
  "message": "Incorrect Password",
  "data": null,
  "error": { "code": 400, "details": "The correct password wasn't entered." }
}
```

3. Server Error (500 Internal Server Error):
```json
{
  "success": false,
  "message": "Invalid Login",
  "data": null,
  "error": { "code": 500, "details": "Error message from server" }
}
```

<details>
<summary>⚠️ **Notes/Details** </summary>

- JWT token expires in 30 days.
- Token is set as an HTTP-only cookie for security. 
- A session record is stored in the database, linked to the user’s device (user-agent) and IP address. 
- The token payload includes: id, username, role, and sessionId. 
- Use data.token in Authorization headers for protected API routes. 

</details>

---

### Authenticate User

**Purpose**:

Verify that a user is authenticated by validating a JWT token provided via cookie or authorization header. 

Returns user information if the token is valid.

**Request**:

- Method: `GET`
- URL: `/auth/authenticate`
- Headers: `Authorization: Bearer <token>` (if not using cookies)
- Cookies(optional): `token=<JWT token>`
- Body: `None`

**Response**:

1. Success (200 OK):
```json
{
  "success": true,
  "message": "Authenticated with JWT token",
  "data": {
    "id": "string (user id)",
    "username": "string (username)",
    "sessionId": "string (session id)"
  },
  "error": null
}
```
2. Client Errors (401 Unauthorized):

- Token not found:
```json
{
  "success": false,
  "message": "Token not found",
  "data": null,
  "error": { "code": 401, "details": "Token not found" }
}
```
3. Server Errors (500 Internal Server Error):
```json
{
  "success": false,
  "message": "Server error",
  "data": null,
  "error": { "code": 500, "details": "Error message from server" }
}
```

<details>
<summary>⚠️ **Notes/Details** </summary>

- Token is checked first in cookies (req.cookies.token), then in the Authorization header. 
- JWT is verified using the server secret (super_secret_long_random_string). 
- On success, the response includes id, username, and sessionId from the token payload. 
- Use this endpoint to confirm that a client session is valid before allowing access to protected routes.

</details>

---

### Fetch Active Sessions

**Purpose**:

Retrieves all session records belonging to the logged-in user. 

Each session includes metadata like IP address, device, creation time, and last activity.

**🔐Authentication Required:**

**Yes — requires a valid JWT token (via cookie or Authorization header).**

**Request**:

- Method: `GET`
- URL: `/auth/sessions`
- Headers: `Authorization: Bearer <token>` (if not using cookies)
- Cookies(optional): `token=<JWT token>`
- Body: `None`

**Response**:

1. Success (200 OK):

```json
{
  "success": true,
  "message": "All sessions found",
  "data": {
    "All Sessions": [
      {
        "session_id": "string",
        "ip_address": "192.168.0.101",
        "device": "Chrome on Windows",
        "created_at": "2025-11-10T11:23:45.000Z",
        "last_seen_at": "2025-11-10T14:22:01.000Z"
      }
    ]
  },
  "error": null
}
```

2. Client Errors (404 Not Found):

```json
{
  "success": false,
  "message": "No sessions found",
  "data": null,
  "error": {
    "code": 404,
    "details": "No sessions found"
  }
}
```

3. Server Errors (500 Internal Server Error):

```json
{
  "success": false,
  "message": "Server error",
  "data": null,
  "error": {
    "code": 500,
    "details": "Error message from server"
  }
}
```

<details>
<summary>⚠️ **Notes/Details** </summary>

- Requires the authenticated user (req.user.id) to be set — typically via middleware that decodes the JWT.
- Useful for showing “active devices” or allowing a user to log out other sessions.

</details>

---

### Delete A Session

**Purpose**:

Deletes a particular session using a session id passed by the url.

**Request**:

- Method: `DELETE`
- URL: `/auth/sessions/:session_id`
- Headers: `null`
- Body: `None`

**Response**:

1. Success (204 OK):

```json
{
  "success": true,
  "message": "Session Revoked Successfully",
  "data": null,
  "error": null
}
```

2. Client Errors (404 Not Found):

```json
{
  "success": false,
  "message": "No sessions found",
  "data": null,
  "error": {
    "code": 404,
    "details": "No session found"
  }
}
```

3. Server Errors (500 Internal Server Error):

```json
{
  "success": false,
  "message": "Server error",
  "data": null,
  "error": {
    "code": 500,
    "details": "Error message from server"
  }
}
```

<details>
<summary>⚠️ **Notes/Details** </summary>

- Deletes a session using id provided from the url
- Useful for revoking access to your account.

</details>

---

## ✉️ Email Verification Routes

Routes for verifying a new user's email address using a one-time password (OTP).

### Generate OTP

**Purpose**:

Generates a 5-minute OTP, stores it, and emails it to the user. This should be called after registration.

**Request**:

-   Method: `POST`
-   URL: `/auth/generate-otp`
-   Headers: `Content-Type: application/json`
-   Body:

```json
{
  "user_id": "string (The ID of the user who needs verification)"
}
```

**Response**:

1. Success (201 Created)

- Sent when the OTP is generated and the email is successfully queued.

- `Note:` The OTP is not returned in the response for security.

```json
{
  "success": true,
  "message": "OTP generated and sent successfully.",
  "data": {
    "expires_at": "2025-11-10T17:54:20.000Z"
  },
  "error": null
}
```

2. Client Errors (400 Bad Request):

- Missing user_id.
```json
{
  "success": false,
  "message": "Bad Request",
  "data": null,
  "error": {
    "code": 400,
    "details": [
      "user_id is required"
    ]
  }
}
```

3. Client Errors (404 Not Found):

- The provided user_id does not match any user.

```json
{
  "success": false,
  "message": "User not found",
  "data": null,
  "error": {
    "code": 404,
    "details": "No user found with the provided user_id."
  }
}
```

4. Client Errors (409 Conflict):

- The user's email is already marked as verified.

```json
{
  "success": false,
  "message": "Account already verified",
  "data": null,
  "error": {
    "code": 409,
    "details": "This user account has already been verified."
  }
}
```

5. Server Error (500 Internal Server Error):

- Database connection failed or the email service failed.

```json
{
  "success": false,
  "message": "Server error",
  "data": null,
  "error": { "code": 500, "details": "Error message from server" }
}
```

---

### Submit (Verify) OTP

**Purpose**:

Verify a submitted OTP. If valid, mark the user's email as verified.

**Request**:

- Method: `POST`
- URL: /auth/verify-otp
- Headers; `Content-Type: application/json`
- Body
```json
{
  "user_id": "string",
  "otp": "string (The 6-digit OTP from the email)"
}
```

**Response**:

1. Success (200 OK)

The OTP was correct and the user's account is now verified.

```json
{
  "success": true,
  "message": "Email successfully verified.",
  "data": {
    "user": {
      "id": "uuid-123-abc",
      "username": "nahom"
    }
  },
  "error": null
}
```

2. Client Errors (400 Bad Request):

```json
{
  "success": false,
  "message": "Invalid OTP",
  "data": null,
  "error": {
    "code": 400,
    "details": "Invalid OTP"
  }
}
```

- (Example for expired OTP)

```json
{
  "success": false,
  "message": "OTP has expired",
  "data": null,
  "error": {
    "code": 400,
    "details": "OTP has expired"
  }
}
```

5. Server Error (500 Internal Server Error):

- Database connection failed.

```json
{
  "success": false,
  "message": "Server error",
  "data": null,
  "error": { "code": 500, "details": "Error message from server" }
}
```

---

## 🔐 Password Reset Routes

### Generate Password Reset Token

**Purpose**:  

Generates a password reset token for a user, returning the token, user's email, and token expiration time.  

**Request**:

- Method: `POST`
- URL: `/password-reset/generate-password-reset`
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "user_id": "string (required)"
}
````

**Response**:

1. **Success** (201 Created):

```json
{
  "success": true,
  "message": "Password reset token generated",
  "data": {
    "token": "string",
    "email": "string",
    "expiresAt": "ISO 8601 date string"
  },
  "error": null
}
```

2. **Client Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Missing user id",
  "data": null,
  "error": {
    "code": 400,
    "message": "Missing user id"
  }
}
```

3. **Server Error** (502 Bad Gateway):

```json
{
  "success": false,
  "message": "Bad Gateway",
  "data": null,
  "error": {
    "code": 502,
    "message": "Failed to generate a password reset token"
  }
}
```

4. **Server Error** (500 Internal Server Error):

```json
{
  "success": false,
  "message": "Server error",
  "data": null,
  "error": {
    "code": 500,
    "message": "Server Error"
  }
}
```

---

### Reset Password

**Purpose**:

Resets a user's password using a valid token. Performs password strength validation and updates the password securely.

**Request**:

* Method: `POST`
* URL: `/password-reset/update-password/:token`
* Headers: `Content-Type: application/json`
* Body:

```json
{
  "password": "string (min 8 chars, includes uppercase, lowercase, number, special char)"
}
```

**Response**:

1. **Success** (200 OK):

```json
{
  "success": true,
  "message": "Successfully validated token",
  "data": {
    "detail": "Successfully updated password"
  },
  "error": null
}
```

2. **Client Errors** (400 Bad Request):

* Missing Credentials:

```json
{
  "success": false,
  "message": "Missing Credentials",
  "data": null,
  "error": {
    "code": 400,
    "message": "Missing token and the new password"
  }
}
```

* Invalid/Expired Token:

```json
{
  "success": false,
  "message": "Bad Request",
  "data": null,
  "error": {
    "code": 400,
    "message": "Token expired or invalid"
  }
}
```

3. **Unprocessable Inputs** (422 Unprocessable Entity):

```json
{
  "success": false,
  "message": "Unprocessable inputs",
  "data": null,
  "error": {
    "code": 422,
    "details": [
      "Password length should be at least 8 characters.",
      "Password should contain a capital letter.",
      "Password should contain a small letter.",
      "Password should contain a special character.",
      "Password should contain a number."
    ]
  }
}
```

4. **Server Error** (500 Internal Server Error):

```json
{
  "success": false,
  "message": "Server error",
  "data": null,
  "error": {
    "code": 500,
    "message": "Internal Server Error"
  }
}
```
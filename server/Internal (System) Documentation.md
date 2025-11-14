# 🧩 API Documentation

The following documentation outlines the structure, response format, and status codes for the core API.

-----

## 🔗 Base URL

All requests should be prefixed with the following base URL:

`http://localhost:3000/api/`

This API provides endpoints for **authentication**, **password management**, and **user operations**. All endpoints are versionless and start with `/api/` for simplicity.

-----

## 📨 Universal Response Structure

The API uses a standardized JSON response format for both success and error states. Frontends should always check the `success` field first.

### Success Example

```json
{
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
}
```

### Error Example

```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null,
  "error": {
    "code": "INVALID_LOGIN",
    "details": "Password does not match"
  }
}
```

### Response Fields

| Field | Type | Purpose |
| :--- | :--- | :--- |
| `success` | `boolean` | **Always a boolean.** Indicates if the request was successful. Frontends check this first. |
| `message` | `string` | A short, human-readable summary of what happened. |
| `data` | `object` | `null` | Contains any returned objects (user, token, etc). **Will be `null` on error.** |
| `error` | `object` | `null` | Contains machine-readable info for debugging. **Will be `null` on success.** |

-----

## 🚦 HTTP Status Codes

### ✅ Success Codes (2xx)

These codes indicate that the client's request was successfully received, understood, and accepted.

| Code | Meaning | When to Use | Example Message |
| :--- | :--- | :--- | :--- |
| **200 OK** | Successful GET, PUT, DELETE, or POST that doesn’t create a resource. | Login, logout, data retrieval, updates, deletions. | ✅ Login successful |
| **201 Created** | A new resource was successfully created. | User registration, game upload, new community post. | ✅ User registered successfully |
| **202 Accepted** | Request accepted for processing, but not yet complete. | Async tasks, queued uploads, AI processing. | ⚙️ “Game analytics is being generated” |
| **204 No Content** | Success with no response body. | When deleting a session or clearing data. | ✅ Session revoked successfully |

### ❌ Client Error Codes (4xx)

These codes indicate that an error has occurred on the client's side, such as invalid input or authorization issues.

| Code | Meaning | When to Use | Example Message |
| :--- | :--- | :--- | :--- |
| **400 Bad Request** | Invalid input, missing fields, or bad format. | Missing credentials, malformed JSON, weak password. | ❌ Missing credentials |
| **401 Unauthorized** | User is not logged in or the provided token is invalid/expired. | Invalid JWT, missing cookie, wrong password. | ❌ Token expired or missing |
| **403 Forbidden** | User is authenticated, but is not allowed to perform the action (e.g., lack of permissions). | Accessing an admin route as a regular user. | ❌ Access denied |
| **404 Not Found** | The requested resource doesn’t exist. | Invalid username, nonexistent game/post ID. | ❌ User not found |
| **405 Method Not Allowed** | The wrong HTTP method was used for the endpoint. | POST to a GET-only endpoint. | ❌ Use GET instead |
| **409 Conflict** | Resource already exists or the state conflicts with the request. | Duplicate username/email, re-upload of the same game. | ❌ Email already in use |
| **422 Unprocessable Entity** | Data format is correct, but the content failed validation rules. | Password doesn’t meet strength requirements. | ❌ Weak password |
| **429 Too Many Requests** | Rate limit triggered for the client. | Multiple failed logins or excessive requests. | ⚠️ Too many login attempts, try later |

### 🚨 Server Error Codes (5xx)

These codes indicate a failure on the server's side, which should be treated as a bug or a temporary outage.

| Code | Meaning | When to Use | Example Message |
| :--- | :--- | :--- | :--- |
| **500 Internal Server Error** | Unexpected server failure; an uncaught exception occurred. | Database down, uncaught exceptions in the code. | ❌ Server error during login |
| **502 Bad Gateway** | Upstream service (e.g., another API or Database) failed or returned an invalid response. | Payment gateway unreachable, microservice failure. | ⚠️ Chapa API failure |
| **503 Service Unavailable** | The service is temporarily overloaded or under maintenance. | Global rate limiting or planned server maintenance. | ⚠️ Server maintenance |
| **504 Gateway Timeout** | An external API call took too long to respond. | Third-party call timeout (e.g. Gemini AI). | ⚠️ AI support not responding |

---

## Table of Contents

- [Root Endpoint](#root-endpoint)
- [Authentication Endpoints](#authentication-endpoints)
  - [Authentication Health Check](#authentication-health-check)
  - [Register User](#register-user)
  - [Login User](#login-user)
  - [Authenticate User](#authenticate-user)
  - [Fetch Active Sessions](#fetch-active-sessions)
  - [Delete A Session](#delete-a-session)
  - [Start Google Login](#start-google-login)
  - [Google Login Callback](#google-login-callback)
- [Email Verification Endpoints](#email-verification-endpoints)
  - [Generate OTP](#Generate-OTP)
  - [Submit (Verify) OTP](#Submit-Verify-OTP)
- [Password Reset Routes](#Password-Reset-Routes)
  - [Generate Password Reset Token](#Generate-Password-Reset-Token)
  - [Reset Password](#Reset-Password)
- [User Operations Routes](#User-Operations-Routes)
  - [User Router Health Check](#User-Router-Health-Check)
  - [Get User Profile](#Get-User-Profile)
  - [Get User Online Status](#Get-User-Online-Status)
  - [Update User Profile](#Update-User-Profile)
  - [Update Profile Picture](#Update-Profile-Picture)
  - [Soft Delete User Account](#Soft-Delete-User-Account)
- [Debug & Monitoring Routes](#Debug--Monitoring-Routes)
  - [Get Debug Stats](#Get-Debug-Stats)
- [Admin/Moderator Routes](#AdminModerator-Routes)
  - [Admin Router Health Check](#Admin-Router-Health-Check)
  - [Fetch All Users](#Fetch-All-Users)
  - [Admin Soft Delete User](#Admin-Soft-Delete-User)
- [Organization & Membership Routes](#Organization--Membership-Routes)
  - [Health Check](#Health-Check)
  - [Register New Organization](#Register-New-Organization)
  - [Edit Organization Details](#Edit-organization-Details)
  - [Soft Delete Organization](#Soft-Delete-Organization)
  - [Get Organization by Slug](#Get-Organization-by-Slug)
  - [Verify Organization (Owner Action)](#Verify-Organization-Owner-Action)
- [Organization Membership Routes](#Organization-Membership-Routes)
  - [Add Member (Self-Join)](#Add-Member-Self-Join)
  - [Get All Members](#Get-All-Members)
  - [Get Single Member](#Get-Single-Member)
  - [Update Member Role](#Update-Member-Role)
  - [Update Member Role](#Update-Member-Role)

---

## Root Endpoint

### Health Check
**Purpose:** Confirm the server is running and check the basic API response structure.
**Request:** None
- URL: `localhost:3000/`
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Express route is running!",
  "data": null,
  "error": null
}
```

---

---

## Authentication Endpoints

### Authentication Health Check

**Purpose**:

Verify that the authentication router is **running and accessible**. This is useful for monitoring or initial connectivity checks to confirm the service is online.

**Request**:

* **Method**: `GET`
* **URL**: `/auth`
* **Headers**: None Required
* **Body**: None

**Response (200 OK)**:

```json
{
  "success": true,
  "message": "The authentication route is running!",
  "data": null,
  "error": null
}
```

-----

### Register User

**Purpose**:

Create a **new user account** with validated credentials. The process ensures unique username and email, enforces strong password rules, and standardizes name formatting.

**Request**:

* **Method**: `POST`
* **URL**: `/auth/register`
* **Headers**: `Content-Type: application/json`
* **Body**:

```json
{
  "firstname": "string",
  "lastname": "string",
  "username": "string (alphanumeric, min 4 characters, underscores allowed)",
  "email": "string (valid email format, example@example.com)",
  "password": "string (min 8 chars, includes uppercase, lowercase, number, special char)"
}
```

**Response**:

1.  ***Success*** (201 Created)
    ```json
    {
      "success": true,
      "message": "Successfully created user",
      "data": {
        "id": "string",
        "username": "string",
        "email": "string",
        "firstname": "string (Sentence Case)",
        "lastname": "string (Sentence Case)"
      },
      "error": null
    }
    ```
2.  ***Client Errors*** (400 Bad Request, 409 Conflict, 422 Unprocessable Entity)
    > Returns an array of error details in the `error.details` field.
    ```json
    {
      "success": false,
      "message": "Bad Request | Unprocessable inputs | Email address or username is taken",
      "data": null,
      "error": {
        "code": 400 | 422 | 409,
        "details": [
          "Missing Credentials",
          "Password length should be at least 8 characters.",
          "The email has already been taken."
        ]
      }
    }
    ```

3. ***Server Errors*** (500)
    ```json
    {
        "success": false,
        "message": "Server error",
        "data": null,
        "error": {
            "code": 500,
            "details": "error.message"
        }
    }
    ```
---

### Login User

**Purpose**:

Authenticate a user using a **username or email and password**. On success, a session is created, a **JWT token is issued**, and set as an **HTTP-only cookie** for secure client authentication.

**Request**:

* **Method**: `POST`
* **URL**: `/auth/login`
* **Headers**: `Content-Type: application/json`
* **Body**:

```json
{
  "identifier": "string (username or email)",
  "password": "string"
}
```

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "Successfully logged in",
      "data": {
        "token": "JWT token string",
        "user": {
          "id": "string (user id)",
          "name": "string (username)"
        }
      },
      "error": null
    }
    ```
2.  ***Client Errors*** (400 Bad Request)
    ```json
    {
      "success": false,
      "message": "Missing Credentials | Invalid username or email | Incorrect Password",
      "data": null,
      "error": { "code": 400, "details": "Descriptive error message." }
    }
    ```

3. ***Server Errors*** (500)
    ```json
    {
        "success": false,
        "message": "Server error",
        "data": null,
        "error": {
            "code": 500,
            "details": "error.message"
        }
    }
    ```
---

### Authenticate User

**Purpose**:

**Verify that a user is authenticated** by validating the JWT token provided via cookie or authorization header. Returns basic user information if the token is valid.

**Request**:

* **Method**: `GET`
* **URL**: `/auth/authenticate`
* **Headers (Optional)**: `Authorization: Bearer <token>`
* **Cookies (Optional)**: `token=<JWT token>`
* **Body**: `None`

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "Authenticated with JWT token",
      "data": {
        "id": "string (user id)",
        "username": "string (username)",
        "sessionId": "string (session id)",
        "role": "string (user role)"
      },
      "error": null
    }
    ```
2.  ***Client Error*** (401 Unauthorized)
    ```json
    {
      "success": false,
      "message": "Token not found",
      "data": null,
      "error": { "code": 401, "details": "Token not found" }
    }
    ```
3. ***Server Errors*** (500)
    ```json
    {
        "success": false,
        "message": "Server error",
        "data": null,
        "error": {
            "code": 500,
            "details": "error.message"
        }
    }
    ```
-----

### Fetch Active Sessions

**Purpose**:

Retrieves **all active session records** for the currently logged-in user. This requires prior authentication.

**Authentication Required**: **Yes** (Valid JWT token).

**Request**:

* **Method**: `GET`
* **URL**: `/auth/sessions`
* **Headers (Optional)**: `Authorization: Bearer <token>`
* **Cookies (Optional)**: `token=<JWT token>`
* **Body**: `None`

**Response**:

1.  ***Success*** (200 OK)
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
2.  ***Client Error*** (404 Not Found)
    ```json
    {
      "success": false,
      "message": "No sessions found",
      "data": null,
      "error": { "code": 404, "details": "No sessions found" }
    }
    ```

3. ***Server Errors*** (500)
    ```json
    {
        "success": false,
        "message": "Server error",
        "data": null,
        "error": {
            "code": 500,
            "details": "error.message"
        }
    }
    ```
   
---

### Delete A Session

**Purpose**:

Deletes (revokes) a specific user session using its ID from the URL. This is used to remotely log out of another device.

**Request**:

* **Method**: `DELETE`
* **URL**: `/auth/sessions/:session_id`
* **Headers (Optional)**: `Authorization: Bearer <token>`
* **Cookies (Optional)**: `token=<JWT token>`
* **Body**: `None`

**Response**:

1.  ***Success*** (204 No Content)
    ```json
    {
      "success": true,
      "message": "Session Revoked Successfully",
      "data": null,
      "error": null
    }
    ```
2.  ***Client Error*** (404 Not Found)
    ```json
    {
      "success": false,
      "message": "No sessions found",
      "data": null,
      "error": { "code": 404, "details": "No session found" }
    }
    ```

3. ***Server Errors*** (500)
    ```json
    {
        "success": false,
        "message": "Server error",
        "data": null,
        "error": {
            "code": 500,
            "details": "error.message"
        }
    }
    ```
---

Got it. Here are the Google OAuth endpoints documented in the requested format.

-----

### Start Google Login

**Purpose**:

Initiates the Google OAuth flow. The user is **redirected to Google's sign-in page** to grant application permissions.

**Request**:

* **Method**: `GET`
* **URL**: `/auth/google`
* **Headers**: None Required
* **Body**: None

**Response**:

* ***Success*** (302 Found)
  > The server sends a **redirection response** to the client's browser, which immediately redirects the user to `https://accounts.google.com/o/oauth2/auth...` for sign-in.

---

### Google Login Callback

**Purpose**:

This is the **destination URL** that Google redirects the user back to after successful authentication. The server processes the Google user data, checks for an existing account, and either **logs in or registers the user**. Finally, it issues a JWT token.

**Request**:

* **Method**: `GET`
* **URL**: `/auth/google/callback`
* **Headers**: None Required
* **Body**: None
* **Query**: Google appends necessary data (e.g., `code`) to the URL query string.

**Response**:

* ***Success*** (200 OK)

  > The user is typically **redirected to the client-side application's dashboard** URL, which will now have the session cookie set. The final response is usually a redirect to a client-side route, but if the API returns JSON directly, it follows the login success structure:

  ```json
  {
    "success": true,
    "message": "Successfully logged in via Google",
    "data": {
      "token": "JWT token string",
      "user": {
        "id": "string (user id)",
        "name": "string (username)"
      }
    },
    "error": null
  }
  ```

* ***Client Error*** (400 Bad Request)

  ```json
  {
    "success": false,
    "message": "OAuth failed or no user found | Google account has no email",
    "data": null,
    "error": { "code": 400, "details": "Descriptive error message." }
  }
  ```

---

## Email Verification Endpoints

These routes handle the process of verifying a new user's email address using a one-time password (OTP).

### Generate OTP

**Purpose**:

Generates a new **5-minute OTP**, securely stores it in the database, and **sends it via email** to the user. This endpoint should typically be called immediately after a user registers.

**Request**:

* **Method**: `POST`
* **URL**: `/auth/generate-otp`
* **Headers**: `Content-Type: application/json`
* **Body**:

```json
{
  "user_id": "string (The ID of the user who needs verification)"
}
```

**Response**:

1.  ***Success*** (201 Created)
    > Sent when the OTP is generated and the email is successfully queued. Note: The OTP is not returned for security.
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
2.  ***Client Errors*** (400 Bad Request)
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
3.  ***Client Error*** (404 Not Found)
    > The provided `user_id` does not match any user.
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
4.  ***Client Error*** (409 Conflict)
    > The user's email is already marked as verified.
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
5.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Server error",
      "data": null,
      "error": { "code": 500, "details": "Error message from server" }
    }
    ```

-----

### Submit (Verify) OTP

**Purpose**:

**Verifies a submitted OTP** against the database record. If the OTP is valid and not expired, the user's email is permanently marked as verified, and the user is logged in (session and cookie issued).

**Request**:

* **Method**: `POST`
* **URL**: `/auth/verify-otp`
* **Headers**: `Content-Type: application/json`
* **Body**:

```json
{
  "user_id": "string",
  "otp": "string (The 6-digit OTP from the email)"
}
```

**Response**:

1.  ***Success*** (200 OK)
    > The OTP was correct, the account is verified, and a session token is issued.
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
2.  ***Client Errors*** (400 Bad Request)
    > Sent if fields are missing, the OTP is incorrect, or the OTP has expired.
    ```json
    {
      "success": false,
      "message": "Invalid OTP | OTP has expired | Bad Request",
      "data": null,
      "error": {
        "code": 400,
        "details": "Invalid OTP or descriptive missing field message."
      }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Server error",
      "data": null,
      "error": { "code": 500, "details": "Error message from server" }
    }
    ```

---

## Password Reset Routes

These routes handle the secure generation and verification of tokens required to reset a user's password.

### Generate Password Reset Token

**Purpose**:

Generates a time-sensitive, unique password reset token (valid for **5 minutes**). This token, along with the user's email, should be sent to the user via a secondary channel (e.g., email notification) to complete the password reset process.

**Request**:

* **Method**: `POST`
* **URL**: `/password-reset/generate-password-reset`
* **Headers**: `Content-Type: application/json`
* **Body**:

```json
{
  "user_id": "string (required)"
}
```

**Response**:

1.  ***Success*** (201 Created)
    ```json
    {
      "success": true,
      "message": "Password reset token generated",
      "data": {
        "token": "string (the generated token)",
        "email": "string (user's email)",
        "expiresAt": "ISO 8601 date string"
      },
      "error": null
    }
    ```
2.  ***Client Error*** (400 Bad Request)
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
3.  ***Server Error*** (502 Bad Gateway)
    > Indicates a failure in the underlying process (e.g., database) to generate the token.
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
4.  ***Server Error*** (500 Internal Server Error)
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

-----

### Reset Password

**Purpose**:

Allows a user to **set a new password** after successfully verifying ownership using a valid password reset token. The new password is validated for strength before being hashed and updated.

**Request**:

* **Method**: `POST`
* **URL**: `/password-reset/update-password/:token`
* **Headers**: `Content-Type: application/json`
* **URL Parameter**: `:token` (the reset token received via email)
* **Body**:

```json
{
  "password": "string (min 8 chars, includes uppercase, lowercase, number, special char)"
}
```

**Response**:

1.  ***Success*** (200 OK)
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
2.  ***Client Errors*** (400 Bad Request)
    > Sent for missing credentials or an invalid/expired token.
    ```json
    {
      "success": false,
      "message": "Missing Credentials | Bad Request",
      "data": null,
      "error": {
        "code": 400,
        "message": "Missing token and the new password | Token expired or invalid"
      }
    }
    ```
3.  ***Unprocessable Inputs*** (422 Unprocessable Entity)
    > Sent if the new password fails to meet the minimum strength requirements.
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
          "..."
        ]
      }
    }
    ```
4.  ***Server Error*** (500 Internal Server Error)
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

---

## User Operations Routes

Most routes require a valid JWT token via cookie or Authorization header (`authenticateMiddleware`).

### User Router Health Check

**Purpose**:

Verify that the user router is running and accessible. This is the only endpoint that bypasses the authentication middleware.

**Request**:

* **Method**: `GET`
* **URL**: `/`
* **Headers**: None Required
* **Body**: None

**Response (200 OK)**:

```json
{
  "success": true,
  "message": "USER WORKING",
  "data": null,
  "error": null
}
```

---

### Get User Profile

**Purpose**:

Retrieves the profile data for a specified user. The level of detail returned depends on whether the requesting client is the owner of the profile.

**Request**:

* **Method**: `GET`
* **URL**: `/@:username`
* **Headers (Optional)**: `Authorization: Bearer <token>`
* **URL Parameter**: `:username` (The target user's unique username)
* **Body**: None

**Response**:

1.  ***Success (Public View)*** (200 OK)
    > Returned when the request is anonymous or the user is viewing another profile.
    ```json
    {
      "success": true,
      "message": "User data",
      "data": {
        "username": "string",
        "displayName": "string",
        "role": "string (user role)",
        "avatar_url": "string (URL)",
        "bio": "string"
      },
      "error": null
    }
    ```
2.  ***Success (Owner View)*** (200 OK)
    > Returned when the authenticated user is viewing their own profile. Includes sensitive data.
    ```json
    {
      "success": true,
      "message": "User data",
      "data": {
        "username": "string",
        "email": "string",
        "displayName": "string",
        "email_verified": "boolean",
        "role": "string",
        "avatar_url": "string (URL)",
        "bio": "string"
      },
      "error": null
    }
    ```
3.  ***Client Error*** (404 Not Found)
    ```json
    {
      "success": false,
      "message": "User not found | Deactivated user",
      "data": null,
      "error": {
        "code": 404,
        "details": "User by the name of [username] does not exist | User... has deactivated their account"
      }
    }
    ```
4.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Server Error",
      "data": null,
      "error": { "code": 500, "details": "Server Error" }
    }
    ```

---

### Get User Online Status

**Purpose**:

Retrieves a user's current online status and their last seen timestamp.

**Request**:

* **Method**: `GET`
* **URL**: `/@:username/status`
* **Headers (Optional)**: `Authorization: Bearer <token>`
* **URL Parameter**: `:username`
* **Body**: None

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "User online status",
      "data": {
        "username": "string",
        "online": "string (Online | Offline)",
        "last_seen_at": "ISO 8601 date string or null"
      }
    }
    ```
2.  ***Client Error*** (404 Not Found)
    ```json
    {
      "success": false,
      "message": "User not found",
      "data": null,
      "error": {
        "code": 404,
        "details": "User by the name of [username] does not exist"
      }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Server Error",
      "data": null,
      "error": { "code": 500, "details": "Server Error" }
    }
    ```

---

### Update User Profile

**Purpose**:

Allows an authenticated user to update their own profile information, including their username, email, display name, and bio. A new JWT token is issued upon successful username or email change.

**Authentication Required**: **Yes** (Must be logged in and updating own account).

**Request**:

* **Method**: `PATCH`
* **URL**: `/user/@:username/update`
* **Headers**: `Content-Type: application/json`
* **URL Parameter**: `:username` (Must match the authenticated user)
* **Body**:

```json
{
  "newUsername": "string (new username, must be unique)",
  "email": "string (new email, must be unique)",
  "bio": "string",
  "display_name": "string"
}
```

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "Successfully updated user",
      "data": {
        "id": "string (user id)",
        "username": "string (new or existing username)"
      },
      "error": null
    }
    ```
2.  ***Client Errors*** (401 Unauthorized, 400 Bad Request, 422 Unprocessable Entity)
    ```json
    {
      "success": false,
      "message": "Not authorized | Bad Request | Unprocessable inputs",
      "data": null,
      "error": {
        "code": 401 | 400 | 422,
        "details": "You must be logged in... | Missing Credentials | Email addresses should follow..."
      }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Server error",
      "data": null,
      "error": { "code": 500, "details": "Error message from server" }
    }
    ```

-----

### Update Profile Picture

**Purpose**:

Updates the authenticated user's profile picture URL.

**Authentication Required**: **Yes** (Must be logged in and updating own account).

**Request**:

* **Method**: `PATCH`
* **URL**: `/user/@:username/update-profile-picture`
* **Headers**: `Content-Type: application/json`
* **URL Parameter**: `:username`
* **Body**:

```json
{
  "avatar_url": "string (URL of the new profile picture)"
}
```

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "Successfully updated user avatar",
      "data": {
        "avatar_url": "string (new URL)"
      },
      "error": null
    }
    ```
2.  ***Client Errors*** (401 Unauthorized, 400 Bad Request)
    ```json
    {
      "success": false,
      "message": "Not authorized | Missing Credential | User avatar not updated",
      "data": null,
      "error": {
        "code": 401 | 400,
        "details": "You must be logged in... | Missing avatar url"
      }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Server error",
      "data": null,
      "error": { "code": 500, "details": "Error message from server" }
    }
    ```

-----

### Soft Delete User Account

**Purpose**:

Deactivates the authenticated user's account by setting an `is_deleted` flag, effectively hiding the user's profile and restricting access without permanent data removal.

**Authentication Required**: **Yes** (Must be logged in and deleting own account).

**Request**:

* **Method**: `GET` (Note: **`DELETE` is the REST standard**, but this route uses `GET` in the code)
* **URL**: `/user/@:username/delete`
* **Headers (Optional)**: `Authorization: Bearer <token>`
* **URL Parameter**: `:username` (Must match the authenticated user)
* **Body**: None

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "User Deleted",
      "data": {
        "username": "string",
        "deleted": true
      },
      "error": null
    }
    ```
2.  ***Client Error*** (401 Unauthorized)
    ```json
    {
      "success": false,
      "message": "Not authorized",
      "data": null,
      "error": {
        "code": 401,
        "details": "You must be logged in and can only delete your own account"
      }
    }
    ```
3.  ***Client Error*** (400 Bad Request)
    ```json
    {
      "success": false,
      "message": "Missing username | User not found",
      "data": null,
      "error": { "code": 404, "details": "Username wasn't provided | User... does not exist" }
    }
    ```
4.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Server Error",
      "data": null,
      "error": { "code": 500, "details": "Server Error" }
    }
    ```

---

## Debug & Monitoring Routes

The base URL for these monitoring endpoints is `/debug/`.

### Get Debug Stats

**Purpose**:

Provides a comprehensive snapshot of the system's operational status, including database health, server uptime, system memory/CPU usage, and key application statistics. Useful for external monitoring services and internal debugging.

**Note**: This endpoint likely requires high-level authorization (Admin/Monitor role), although the provided code does not enforce it via middleware.

**Request**:

* **Method**: `GET`
* **URL**: `/debug/stats`
* **Headers**: None Required (Authentication may be needed in a production environment)
* **Body**: `None`

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "timestamp": "ISO 8601 date string",
      "total_users": 1500,
      "active_sessions": 42,
      "server_uptime": "15h 23m 45s",
      "process_uptime": "1h 5m 2s",
      "db_status": "healthy | unhealthy",
      "memory": {
        "used": "123.45 MB",
        "total": "1024 MB",
        "usage_percent": "12.05%"
      },
      "cpu": {
        "load_1m": "0.55",
        "load_5m": "0.62",
        "load_15m": "0.41",
        "cores": 8,
        "model": "Intel(R) Core(TM) i7-8550U CPU"
      },
      "node": {
        "version": "v20.10.0",
        "platform": "linux",
        "arch": "x64"
      },
      "process_memory": {
        "rss": "85.20 MB",
        "heapTotal": "52.34 MB",
        "heapUsed": "35.11 MB",
        "external": "10.01 MB"
      },
      "network_interfaces": {
        "lo": [
          // ... network adapter details
        ]
      }
    }
    ```
2.  ***Server Error*** (500 Internal Server Error)
    > Catches exceptions during database queries or system information retrieval.
    ```json
    {
      "success": false,
      "message": "Server error",
      "data": null,
      "error": { "code": 500, "details": "Error message from server" }
    }
    ```

---

## Admin/Moderator Routes

The base URL for these endpoints is `/admin/`. **All routes require authentication** and likely role-based authorization check (Admin or Moderator).

### Admin Router Health Check

**Purpose**:

Verify that the admin router is running and accessible.

**Request**:

* **Method**: `GET`
* **URL**: `/admin`
* **Headers**: None Required
* **Body**: None

**Response (200 OK)**:

```json
{
  "success": true,
  "message": "ADMIN WORKING",
  "data": null,
  "error": null
}
```

---

### Fetch All Users

**Purpose**:

Retrieves a detailed list of **all users** in the system, including those soft-deleted. Requires **Admin or Moderator** role.

**Authentication Required**: **Yes** (Admin or Moderator role).

**Request**:

* **Method**: `GET`
* **URL**: `/admin/users`
* **Headers**: `Authorization: Bearer <token>`
* **Body**: `None`

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "All users found",
      "data": {
        "All Users": [
          {
            "user_id": "string",
            "username": "string",
            "email": "string",
            "email_verified": "boolean",
            "displayName": "string",
            "avatar_url": "string",
            "role": "string",
            "deleted_at": "ISO 8601 date string or null",
            "created": "ISO 8601 date string",
            "updated": "ISO 8601 date string"
          }
        ]
      },
      "error": null
    }
    ```
2.  ***Client Error*** (401 Unauthorized)
    ```json
    {
      "success": false,
      "message": "Not authorized",
      "data": null,
      "error": {
        "code": 401,
        "details": "You must be an admin or a moderator"
      }
    }
    ```
3.  ***Client Error*** (404 Not Found)
    ```json
    {
      "success": false,
      "message": "No users found",
      "data": null,
      "error": { "code": 404, "details": "No users found" }
    }
    ```
4.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Server error",
      "data": null,
      "error": { "code": 500, "details": "Error message from server" }
    }
    ```

-----

### Fetch All Active Users

**Purpose**:

Retrieves a list of all users who have **not** been soft-deleted (`is_deleted = false`).

**Note**: The current controller code for `allActiveUsers` doesn't include the authorization check from `allUsers` and returns a non-standard JSON response on success/failure. The documentation below is based *only* on the controller's success/fail logic.

**Request**:

* **Method**: `GET`
* **URL**: `/admin/users/active`
* **Headers (Optional)**: `Authorization: Bearer <token>`
* **Body**: `None`

**Response**:

1.  ***Success*** (200 OK)
    > Returns an array of user objects directly (Non-standard format).
    ```json
    [
      {
        "id": "string",
        "username": "string",
        "email": "string",
        "is_deleted": false
        /* ... other user fields */
      }
    ]
    ```
2.  ***Client Error*** (404 Not Found)
    ```json
    {
      "message": "No active users"
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "message": "Server error"
    }
    ```

-----

### Admin Soft Delete User

**Purpose**:

Soft deletes (deactivates) a specified user's account by username. While the controller logic is currently restricted to the user deleting their *own* account, this endpoint is placed on the `/admin` route, implying a future requirement for **Admin/Moderator** to delete *other* users.

**Request**:

* **Method**: `DELETE`
* **URL**: `/admin/@:username`
* **Headers**: `Authorization: Bearer <token>`
* **URL Parameter**: `:username` (The target user's username)
* **Body**: `None`

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "User Deleted",
      "data": {
        "username": "string",
        "deleted": true
      },
      "error": null
    }
    ```
2.  ***Client Error*** (401 Unauthorized)
    ```json
    {
      "success": false,
      "message": "Not authorized",
      "data": null,
      "error": {
        "code": 401,
        "details": "You must be logged in and can only delete your own account"
      }
    }
    ```
3.  ***Client Error*** (404 Not Found)
    ```json
    {
      "success": false,
      "message": "User not found",
      "data": null,
      "error": {
        "code": 404,
        "details": "User by the name of [username] does not exist"
      }
    }
    ```
4.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Server Error",
      "data": null,
      "error": { "code": 500, "details": "Server Error" }
    }
    ```

---

## Organization & Membership Routes

The base URL for these endpoints is `/api/organization/`.

---

### Health Check

**Purpose**:

Verifies the organization router is running and accessible.

**Request**:

* **Method**: `GET`
* **URL**: `/organization`
* **Body**: `None`

**Response (200 OK)**:

```json
{
  "success": true,
  "message": "Organization router running",
  "data": null,
  "error": null
}
```

-----

### Register New Organization

**Purpose**:

Creates a new organization. The authenticated user is automatically set as the organization's `owner` and added as the first member.

**Authentication Required**: **Yes**

**Request**:

* **Method**: `POST`
* **URL**: `/organization/register`
* **Headers**: `Content-Type: application/json`
* **Body**:

```json
{
  "name": "string (The full organization name)",
  "slug": "string (A unique URL-friendly identifier, e.g., 'acme-corp')",
  "description": "string (Optional organization description)",
  "website_url": "string (Optional external website URL)"
}
```

**Response**:

1.  ***Success*** (201 Created)
    ```json
    {
      "success": true,
      "message": "Organization created successfully",
      "data": {
        "organization": {
          "id": "uuid",
          "owner_id": "uuid",
          "name": "string",
          "slug": "string",
          "is_verified_developer": false
          // ... other organization fields
        }
      },
      "error": null
    }
    ```
2.  ***Client Errors*** (401 Unauthorized, 400 Bad Request, 409 Conflict)
    ```json
    {
      "success": false,
      "message": "Not authorized | Invalid organization name | Organization slug already exists",
      "data": null,
      "error": {
        "code": "UNAUTHORIZED" | "INVALID_INPUT" | "DUPLICATE_SLUG",
        "details": "..."
      }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Internal server error",
      "data": null,
      "error": { "code": "INTERNAL_ERROR", "details": "..." }
    }
    ```

---

### Edit Organization Details

**Purpose**:

Updates the organization's details (`name`, `slug`, etc.). **Only the organization owner** can perform this action.

**Authentication Required**: **Yes** (Must be the organization owner)

**Request**:

* **Method**: `PATCH`
* **URL**: `/organization/update/:id`
* **URL Parameter**: `:id` (The organization's unique ID)
* **Body**: (Fields are optional for update, but typically you send what you want to change)

```json
{
  "name": "string",
  "slug": "string",
  "description": "string"
}
```

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "Organization updated successfully",
      "data": { "organization": { /* updated organization object */ } },
      "error": null
    }
    ```
2.  ***Client Errors*** (401 Unauthorized, 404 Not Found, 409 Conflict)
    ```json
    {
      "success": false,
      "message": "Not authorized | Organization not found or not owned by user | Slug already in use",
      "data": null,
      "error": { "code": "UNAUTHORIZED" | "NOT_FOUND" | "DUPLICATE_SLUG", "details": "..." }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Internal server error",
      "data": null,
      "error": { "code": "INTERNAL_ERROR", "details": "..." }
    }
    ```

---

### Soft Delete Organization

**Purpose**:

Marks an organization as deleted (`soft delete`). **Only the organization owner** can perform this action.

**Authentication Required**: **Yes** (Must be the organization owner)

**Request**:

* **Method**: `POST` (Note: **`DELETE` is the REST standard**)
* **URL**: `/organization/delete/:id`
* **URL Parameter**: `:id` (The organization's unique ID)
* **Body**: `None`

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "Organization deleted successfully",
      "data": { "organization": { /* deleted organization object */ } },
      "error": null
    }
    ```
2.  ***Client Errors*** (401 Unauthorized, 404 Not Found)
    ```json
    {
      "success": false,
      "message": "Not authorized | Organization not found or not owned by you",
      "data": null,
      "error": { "code": "UNAUTHORIZED" | "NOT_FOUND", "details": "..." }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Internal server error",
      "data": null,
      "error": { "code": "INTERNAL_ERROR", "details": "..." }
    }
    ```

---

### Get Organization by Slug

**Purpose**:

Retrieves public information about an organization using its unique URL slug. If the authenticated user is the owner, full organization details are returned.

**Authentication Required**: No (Public access, but sensitive fields are hidden if not owner)

**Request**:

* **Method**: `GET`
* **URL**: `/organization/@:slug`
* **URL Parameter**: `:slug` (The organization's URL identifier)
* **Body**: `None`

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "Organization retrieved successfully",
      "data": {
        "organization": {
          "id": "uuid",
          "name": "string",
          "slug": "string",
          "description": "string",
          "website_url": "string",
          "is_verified_developer": "boolean"
          // ... additional fields only if user is owner
        }
      },
      "error": null
    }
    ```
2.  ***Client Error*** (404 Not Found)
    ```json
    {
      "success": false,
      "message": "Organization not found",
      "data": null,
      "error": { "code": "NOT_FOUND", "details": "No organization exists with the provided slug" }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Internal server error",
      "data": null,
      "error": { "code": "INTERNAL_ERROR", "details": "..." }
    }
    ```

---

### Verify Organization (Owner Action)

**Purpose**:

Marks an organization as verified. The exact logic for verification is external, but this endpoint sets the flag in the database. **Only the organization owner** can perform this action.

**Authentication Required**: **Yes** (Must be the organization owner)

**Request**:

* **Method**: `POST`
* **URL**: `/organization/verify/:id`
* **URL Parameter**: `:id` (The organization's unique ID)
* **Body**: `None`

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "Organization verified successfully",
      "data": { "organization": { /* updated organization object */ } },
      "error": null
    }
    ```
2.  ***Client Errors*** (401 Unauthorized, 404 Not Found, 403 Forbidden)
    ```json
    {
      "success": false,
      "message": "Not authorized | Organization not found | Forbidden",
      "data": null,
      "error": { "code": "UNAUTHORIZED" | "NOT_FOUND" | "FORBIDDEN", "details": "..." }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Internal server error",
      "data": null,
      "error": { "code": "INTERNAL_ERROR", "details": "..." }
    }
    ```

---

## Organization Membership Routes

### Add Member (Self-Join)

**Purpose**:

Allows an authenticated user to join an organization.

**Note**: The current controller logic does not check membership/ownership/admin roles, it simply adds the **authenticated user** to the organization specified by the slug.

**Authentication Required**: **Yes**

**Request**:

* **Method**: `POST`
* **URL**: `/organization/@:slug/add-member`
* **URL Parameter**: `:slug` (The target organization's slug)
* **Body**: `None`

**Response**:

1.  ***Success*** (201 Created)
    ```json
    {
      "success": true,
      "message": "Member added successfully",
      "data": {
        "member": {
          "org_id": "uuid",
          "user_id": "uuid",
          "role": "member",
          "joined_at": "ISO 8601 date string"
        }
      },
      "error": null
    }
    ```
2.  ***Client Error*** (401 Unauthorized)
    ```json
    {
      "success": false,
      "message": "Not authorized",
      "data": null,
      "error": { "code": "UNAUTHORIZED", "details": "Login required" }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Internal server error",
      "data": null,
      "error": { "code": "INTERNAL_ERROR", "details": "..." }
    }
    ```

-----

### Get All Members

**Purpose**:

Retrieves a list of all members in the organization.

**Note**: The current controller logic restricts this to **only the organization owner**.

**Authentication Required**: **Yes** (Must be the organization owner)

**Request**:

* **Method**: `GET`
* **URL**: `/organization/@:slug/members`
* **URL Parameter**: `:slug`
* **Body**: `None`

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "Members retrieved",
      "data": {
        "members": [
          {
            "org_id": "uuid",
            "user_id": "uuid",
            "role": "string",
            "joined_at": "ISO 8601 date string"
            // ... potentially user data joined here
          }
        ]
      },
      "error": null
    }
    ```
2.  ***Client Error*** (401 Unauthorized)
    ```json
    {
      "success": false,
      "message": "Not authorized",
      "data": null,
      "error": { "code": "UNAUTHORIZED", "details": "Login required" }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Internal server error",
      "data": null,
      "error": { "code": "INTERNAL_ERROR", "details": "..." }
    }
    ```

---

### Get Single Member

**Purpose**:

Retrieves the membership status (user and role) for a specific user within an organization.

**Authentication Required**: No (Public visibility)

**Request**:

* **Method**: `GET`
* **URL**: `/organization/@:slug/@:username`
* **URL Parameters**: `:slug` (Organization slug), `:username` (Target user's username)
* **Body**: `None`

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "Member retrieved",
      "data": {
        "member": {
          "org_id": "uuid",
          "user_id": "uuid",
          "role": "string",
          "joined_at": "ISO 8601 date string"
        }
      },
      "error": null
    }
    ```
2.  ***Client Error*** (404 Not Found)
    ```json
    {
      "success": false,
      "message": "Organization not found | User not found | Member not found",
      "data": null,
      "error": { "code": "NOT_FOUND", "details": "..." }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Internal server error",
      "data": null,
      "error": { "code": "INTERNAL_ERROR", "details": "..." }
    }
    ```

-----

### Update Member Role

**Purpose**:

Updates the role of a user within an organization, subject to strict Role-Based Access Control (RBAC) rules.

**Valid Roles**: `member`, `moderator`, `developer`, `finance`, `admin`, `owner`.

**Authentication Required**: **Yes** (Owner or Admin required to manage roles)

**Request**:

* **Method**: `POST`
* **URL**: `/organization/@:slug/update-role`
* **URL Parameter**: `:slug`
* **Body**:

```json
{
  "username": "string (The username of the member whose role is being changed)",
  "role": "string (The new role to assign)"
}
```

**Response**:

1.  ***Success*** (200 OK)
    ```json
    {
      "success": true,
      "message": "Member role updated successfully",
      "data": { "member": { /* updated member object */ } },
      "error": null
    }
    ```
2.  ***Client Errors*** (401 Unauthorized, 404 Not Found, 403 Forbidden, 400 Bad Request)
    ```json
    {
      "success": false,
      "message": "Not authorized | User or organization not found | Forbidden | Invalid role",
      "data": null,
      "error": { "code": "UNAUTHORIZED" | "NOT_FOUND" | "FORBIDDEN" | "INVALID_ROLE", "details": "..." }
    }
    ```
3.  ***Server Error*** (500 Internal Server Error)
    ```json
    {
      "success": false,
      "message": "Internal server error",
      "data": null,
      "error": { "code": "INTERNAL_ERROR", "details": "..." }
    }
    ```

---
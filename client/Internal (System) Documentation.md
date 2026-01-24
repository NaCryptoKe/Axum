# API Documentation

The following documentation outlines the structure, response format, and status codes for the core API.

-----

## Base URL

All requests should be prefixed with the following base URL:

`http://localhost:3000/api/`

This API provides endpoints for **authentication**, **password management**, and **user operations**. All endpoints are versionless and start with `/api/` for simplicity.

-----

## Universal Response Structure

The API uses a standardized JSON response format for both success and error states. Frontends should always check the `status` field first.

### Success Example

```json
{
  "status": "success",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "uuid",
      "username": "nahom",
      "email": "nahom@example.com"
    }
  },
  "meta": {
    "timestamp": "2026-01-19T12:50:44Z",
    "requestId": "req_882345"
  }
}
```

### Error Example

```json
{
  "status": "error",
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_LOGIN",
    "details": "Password does not match"
  }
}
```

### Response Fields

| Field | Type | Purpose |
| :--- | :--- | :--- |
| `status` | `string` | **"success" or "error".** Indicates if the request was successful. |
| `message` | `string` | A short, human-readable summary of what happened (mostly for errors). |
| `data` | `object` | `array` | Contains any returned objects (user, token, etc). **Will be an empty object or array on error.** |
| `error` | `object` | Contains machine-readable info for debugging. **Will be `null` on success.** |
| `meta` | `object` | Contains non-business data like timestamps and request IDs. |
| `pagination`| `object` | For list responses, contains pagination details. |

-----

## HTTP Status Codes

### Success Codes (2xx)

| Code | Meaning | When to Use |
| :--- | :--- | :--- |
| **200 OK** | Successful fetch or update. |
| **201 Created** | A new resource was successfully created. |
| **204 No Content** | Success with no response body. |

### Client Error Codes (4xx)

| Code | Meaning | When to Use |
| :--- | :--- | :--- |
| **400 Bad Request** | Validation errors or malformed JSON. |
| **401 Unauthorized** | Session expired or invalid token. |
| **403 Forbidden** | User is authenticated, but is not allowed to perform the action. |
| **404 Not Found** | The requested resource doesn’t exist. |
| **409 Conflict** | Resource already exists or the state conflicts with the request. |
| **422 Unprocessable Entity** | Data format is correct, but the content failed validation rules. |
| **429 Too Many Requests** | Rate limit triggered for the client. |

### Server Error Codes (5xx)

| Code | Meaning | When to Use |
| :--- | :--- | :--- |
| **500 Internal Server Error** | Unexpected server failure; an uncaught exception occurred. |

-----

## Table of Contents

- [Root Endpoint](#root-endpoint)
- [Authentication Endpoints](#authentication-endpoints)
- [Password Reset Endpoints](#password-reset-endpoints)
- [User Endpoints](#user-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Admin User Management](#admin-user-management)
- [Organization Endpoints](#organization-endpoints)
- [Community Endpoints](#community-endpoints)
- [Game Catalog Endpoints](#game-catalog-endpoints)
- [Social Endpoints](#social-endpoints)
- [Notification Endpoints](#notification-endpoints)
- [Analytics Endpoints](#analytics-endpoints)
- [Publishing Endpoints](#publishing-endpoints)
- [Financials Endpoints](#financials-endpoints)
- [Debug Endpoints](#debug-endpoints)

-----

## Root Endpoint

### Health Check
**Purpose:** Confirm the server is running and check the basic API response structure.
**Request:**
- **Method:** `GET`
- **URL:** `/health`
**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Welcome to the server!"
  },
  "meta": {
    "timestamp": "2026-01-22T10:00:00Z"
  }
}
```
-----

## Authentication Endpoints

Base Path: `/api/auth`

### Health Check

**Purpose**: Verify that the authentication router is running and accessible.
**Request**:
- **Method**: `GET`
- **URL**: `/api/auth/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": null,
  "meta": {
    "timestamp": "2026-01-22T10:00:00Z",
    "requestId": "req_12345"
  }
}
```

---

### Register User

**Purpose**: Create a new user account.
**Request**:
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Body**:
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "aVeryComplexPassword123!"
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "data": {
    "id": "user-uuid-123",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "firstname": "John",
    "lastname": "Doe"
  },
  "meta": {
    "timestamp": "2026-01-22T10:01:00Z",
    "requestId": "req_12346"
  }
}
```
**Error Response (422 Unprocessable Entity - Validation Error)**:
```json
{
  "status": "error",
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "type": "Bad Request",
    "fields": {
      "username": {
        "code": "INVALID_FORMAT",
        "message": "Username must be at least 4 characters and contain only letters, numbers, and underscores."
      }
    }
  }
}
```
**Error Response (409 Conflict - User Exists)**:
```json
{
    "status": "error",
    "message": "Conflict",
    "error": {
        "code": "VALIDATION_ERROR",
        "type": "Conflict",
        "fields": {
            "email": {
                "code": "ALREADY_TAKEN",
                "message": "This email is already in use."
            }
        }
    }
}
```

---

 

### Authenticate User

**Purpose**: Verify a user's JWT token and get their session data.
**Authentication**: Required (JWT Token in cookie or `Authorization` header).
**Request**:
- **Method**: `GET`
- **URL**: `/api/auth/authenticate`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "id": "user-uuid-123",
    "username": "johndoe",
    "role": "player",
    "sessionId": "session-uuid-456",
    "avatarUrl": "https://example.com/avatar.png"
  },
  "meta": {
    "timestamp": "2026-01-22T10:03:00Z",
    "requestId": "req_12348"
  }
}
```

---

### Logout User

**Purpose**: Log out the user by deleting their session and clearing the auth cookie.
**Authentication**: Required.
**Request**:
- **Method**: `POST`
- **URL**: `/api/auth/logout`
**Response (200 OK)**:
- The `token` cookie is cleared.
```json
{
  "status": "success",
  "data": null,
  "meta": {
    "timestamp": "2026-01-22T10:04:00Z",
    "requestId": "req_12349"
  }
}
```

---
## Email Verification Endpoints

Base Path: `/api/auth`

### Generate OTP

**Purpose**: Generate and send a new 5-minute OTP to the user's email for verification.
**Request**:
- **Method**: `POST`
- **URL**: `/api/auth/generate-otp`
- **Body**:
```json
{
  "user_id": "user-uuid-123"
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "data": {
    "expiresAt": "2026-01-22T10:10:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-22T10:05:00Z",
    "requestId": "req_12350"
  }
}
```

---

### Verify OTP

**Purpose**: Verify the submitted OTP. If correct, the user's email is marked as verified, and a session is created.
**Request**:
- **Method**: `POST`
- **URL**: `/api/auth/verify-otp`
- **Body**:
```json
{
  "user_id": "user-uuid-123",
  "otp": "123456"
}
```
**Response (200 OK)**:
- An `httpOnly` cookie named `token` is set.
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-uuid-123",
      "username": "johndoe"
    }
  },
  "meta": {
    "timestamp": "2026-01-22T10:06:00Z",
    "requestId": "req_12351"
  }
}
```
**Error Response (400 Bad Request - Invalid OTP)**:
```json
{
    "status": "error",
    "message": "Invalid OTP",
    "error": {
        "code": "INVALID_OTP",
        "details": "Invalid OTP"
    }
}
```

---
## Session Management

Base Path: `/api/auth`

### Get All User Sessions

**Purpose**: Retrieve all active sessions for the authenticated user.
**Authentication**: Required.
**Request**:
- **Method**: `GET`
- **URL**: `/api/auth/sessions`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": [
    {
      "sessionId": "session-uuid-456",
      "ipAddress": "127.0.0.1",
      "device": "Chrome on Windows",
      "createdAt": "2026-01-22T10:02:00.000Z",
      "lastSeenAt": "2026-01-22T10:03:00.000Z"
    }
  ],
  "meta": {
    "timestamp": "2026-01-22T10:07:00Z",
    "requestId": "req_12352"
  }
}
```

---

### Delete User Session

**Purpose**: Delete a specific session, effectively logging the user out from that device.
**Authentication**: Required.
**Request**:
- **Method**: `DELETE`
- **URL**: `/api/auth/sessions/:session_id`
- **URL Parameters**:
  - `session_id` (string, required): The ID of the session to delete.
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": null,
  "meta": {
    "timestamp": "2026-01-22T10:08:00Z",
    "requestId": "req_12353"
  }
}
```

---

## Google OAuth Endpoints

Base Path: `/api/auth`

### Start Google Login

**Purpose**: Initiates the Google OAuth flow by redirecting the user to Google's sign-in page.
**Request**:
- **Method**: `GET`
- **URL**: `/api/auth/google`
**Response**:
- **302 Found**: Redirects to Google's OAuth consent screen.

---


### Google Login Callback

**Purpose**: The callback URL Google redirects to after authentication. The server handles user creation or login and sets a session cookie.
**Request**:
- **Method**: `GET`
- **URL**: `/api/auth/google/callback`
**Response**:
- **302 Found**: Redirects the user to the frontend application (e.g., `http://localhost:5173/`) with the `token` cookie set.

---

## Password Reset Endpoints

Base Path: `/api/password-reset`

### Health Check

**Purpose**: Verify that the password reset router is running and accessible.
**Request**:
- **Method**: `GET`
- **URL**: `/api/password-reset/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "Password Reset Router is working"
  },
  "meta": {
    "timestamp": "2026-01-22T10:10:00Z"
  }
}
```

---

### Generate Password Reset Token

**Purpose**: Generates a 5-minute password reset token and sends a reset link to the user's email.
**Request**:
- **Method**: `POST`
- **URL**: `/api/password-reset/generate-password-reset`
- **Body**:
```json
{
  "identifier": "johndoe"
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Password reset link has been sent to the associated email address.",
  "data": {
    "token": "reset-token-uuid-789",
    "email": "john.doe@example.com",
    "expiresAt": "2026-01-22T10:16:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-22T10:11:00Z",
    "requestId": "req_12354"
  }
}
```

---

### Reset Password

**Purpose**: Sets a new password for a user using a valid reset token.
**Request**:
- **Method**: `POST`
- **URL**: `/api/password-reset/update-password/:token`
- **URL Parameters**:
  - `token` (string, required): The password reset token from the email link.
- **Body**:
```json
{
  "password": "myNewSecurePassword123!"
}
```
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "detail": "Successfully updated password"
  },
  "meta": {
    "timestamp": "2026-01-22T10:12:00Z",
    "requestId": "req_12355"
  }
}
```
**Error Response (422 Unprocessable Entity - Weak Password)**:
```json
{
    "status": "error",
    "message": "Unprocessable inputs",
    "error": {
        "code": "VALIDATION_ERROR",
        "fields": {
            "password": {
                "code": "WEAK_PASSWORD",
                "message": "Password length should be at least 8 characters."
            }
        }
    }
}
```

---

## User Endpoints

Base Path: `/api/users`

### Health Check

**Purpose**: Verify that the user router is running and accessible.
**Request**:
- **Method**: `GET`
- **URL**: `/api/users/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "USER WORKING"
  },
  "meta": {
    "timestamp": "2026-01-22T10:15:00Z"
  }
}
```

---

### Get User Profile

**Purpose**: Retrieve a user's profile information. Returns extended details if the requester is the profile owner or an admin.
**Authentication**: Required.
**Request**:
- **Method**: `GET`
- **URL**: `/api/users/@:username`
- **URL Parameters**:
  - `username` (string, required): The username of the user to retrieve.
**Response (200 OK - Public View)**:
```json
{
  "status": "success",
  "data": {
    "id": "user-uuid-123",
    "username": "johndoe",
    "firstname": "John",
    "lastname": "Doe",
    "displayName": "John D.",
    "role": "player",
    "profilePicture": "https://example.com/avatar.png",
    "bio": "Hello world!",
    "createdAt": "2026-01-20T14:30:00Z",
    "isOnline": true
  },
  "meta": {
    "timestamp": "2026-01-22T10:16:00Z",
    "requestId": "req_12356"
  }
}
```
**Response (200 OK - Owner/Admin View)**:
```json
{
  "status": "success",
  "data": {
    "id": "user-uuid-123",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "displayName": "John D.",
    "email_verified": true,
    "role": "player",
    "profilePicture": "https://example.com/avatar.png",
    "bio": "Hello world!",
    "createdAt": "2026-01-20T14:30:00Z",
    "isOnline": true
  },
  "meta": {
    "timestamp": "2026-01-22T10:17:00Z",
    "requestId": "req_12357"
  }
}
```

---

### Get User Online Status

**Purpose**: Retrieve a user's current online status and last seen timestamp.
**Authentication**: Required.
**Request**:
- **Method**: `GET`
- **URL**: `/api/users/@:username/status`
- **URL Parameters**:
  - `username` (string, required): The username of the user.
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "username": "johndoe",
    "online": "Online",
    "last_seen_at": "2026-01-22T10:17:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-22T10:18:00Z",
    "requestId": "req_12358"
  }
}
```

---

### Update User Profile

**Purpose**: Allows a user to update their own profile. Admins can update any user's profile. A new JWT is issued if the user changes their own details.
**Authentication**: Required (User must be verified, owner of the account, or an admin).
**Request**:
- **Method**: `PATCH`
- **URL**: `/api/users/@:username/update`
- **URL Parameters**:
  - `username` (string, required): The username to update.
- **Body**:
```json
{
  "newUsername": "john_doe_new",
  "email": "john.doe.new@example.com",
  "bio": "An updated bio.",
  "display_name": "Johnny D."
}
```
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "id": "user-uuid-123",
    "username": "john_doe_new"
  },
  "meta": {
    "timestamp": "2026-01-22T10:19:00Z",
    "requestId": "req_12359"
  }
}
```

---

### Update Profile Picture

**Purpose**: Allows a user to update their own profile picture. Admins can update any user's picture.
**Authentication**: Required (User must be verified, owner of the account, or an admin).
**Request**:
- **Method**: `PATCH`
- **URL**: `/api/users/@:username/update-profile-picture`
- **URL Parameters**:
  - `username` (string, required): The username to update.
- **Body**:
```json
{
  "avatar_url": "https://example.com/new-avatar.png"
}
```
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "avatar_url": "https://example.com/new-avatar.png"
  },
  "meta": {
    "timestamp": "2026-01-22T10:20:00Z",
    "requestId": "req_12360"
  }
}
```

---

### Soft Delete User

**Purpose**: Deactivates a user account. The user can delete their own account. Admins/Moderators can delete any account.
**Authentication**: Required (User must be verified, owner of the account, or an admin/moderator).
**Request**:
- **Method**: `DELETE`
- **URL**: `/api/users/@:username`
- **URL Parameters**:
  - `username` (string, required): The username to soft delete.
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "username": "johndoe",
    "deleted": true
  },
  "meta": {
    "timestamp": "2026-01-22T10:21:00Z",
    "requestId": "req_12361"
  }
}
```

---

### Get All Active Users

**Purpose**: Retrieve a paginated list of all active (not soft-deleted) users.
**Authentication**: Required.
**Request**:
- **Method**: `GET`
- **URL**: `/api/users/active`
- **Query Parameters**:
  - `page` (number, optional, default: 1): The page number.
  - `limit` (number, optional, default: 10): The number of users per page.
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": [
    {
      "username": "johndoe",
      "displayName": "John D.",
      "avatarUrl": "https://example.com/avatar.png"
    }
  ],
  "pagination": {
    "totalRecords": 1,
    "currentPage": 1,
    "totalPages": 1,
    "limit": 10,
    "hasNext": false,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2026-01-22T10:22:00Z",
    "requestId": "req_12362"
  }
}
```
---

## Admin Endpoints

Base Path: `/api/admin`

These endpoints are for administrative purposes and require appropriate permissions.

### Health Check

**Purpose**: Verify that the admin router is running and accessible.
**Request**:
- **Method**: `GET`
- **URL**: `/api/admin/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "ADMIN WORKING"
  },
  "meta": {
    "timestamp": "2026-01-22T10:28:00Z"
  }
}
```

---

### User Management Endpoints

The primary user management endpoints for administrators are available under the `/api/users/admin` path. However, this route provides some aliases.

- `GET /api/admin/users`: Alias for retrieving all users (same as `GET /api/users/admin/all`).
- `GET /api/admin/users/active`: Alias for retrieving all active users (same as `GET /api/users/active`).
- `DELETE /api/admin/@:username`: Alias for soft-deleting a user (same as `DELETE /api/users/@:username`).

Please refer to the **Admin User Management** and **User Endpoints** sections for detailed documentation on these functionalities.

---

## Admin User Management

Base Path: `/api/users/admin`

All endpoints in this section require **Admin** role.

### Get All Users

**Purpose**: Retrieves a paginated list of all users in the system, including soft-deleted ones.
**Authentication**: Required (Admin or Moderator role).
**Request**:
- **Method**: `GET`
- **URL**: `/api/users/admin/all`
- **Query Parameters**:
  - `page` (number, optional, default: 1): The page number.
  - `limit` (number, optional, default: 10): The number of users per page.
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": [
    {
      "userId": "user-uuid-123",
      "username": "johndoe",
      "email": "john.doe@example.com",
      "emailVerified": true,
      "displayName": "John D.",
      "avatarUrl": "https://example.com/avatar.png",
      "role": "player",
      "deletedAt": null,
      "createdAt": "2026-01-20T14:30:00Z",
      "updatedAt": "2026-01-22T10:19:00Z"
    }
  ],
  "pagination": {
    "totalRecords": 1,
    "currentPage": 1,
    "totalPages": 1,
    "limit": 10,
    "hasNext": false,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2026-01-22T10:24:00Z",
    "requestId": "req_12364"
  }
}
```

---

### Change User Role

**Purpose**: Change a user's role.
**Authentication**: Required (Admin role).
**Request**:
- **Method**: `PATCH`
- **URL**: `/api/users/admin/users/@:username/role`
- **URL Parameters**:
  - `username` (string, required): The username of the user to modify.
- **Body**:
```json
{
  "username": "someuser",
  "role": "moderator"
}
```
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "User someuser's role updated to moderator.",
  "data": {
    "id": "user-uuid-789",
    "username": "someuser",
    "role": "moderator",
    "...": "..."
  },
  "meta": {
    "timestamp": "2026-01-22T10:25:00Z",
    "requestId": "req_12365"
  }
}
```

---

### Undelete User

**Purpose**: Reactivates a soft-deleted user account.
**Authentication**: Required (Admin role).
**Request**:
- **Method**: `PATCH`
- **URL**: `/api/users/admin/users/@:username/undelete`
- **URL Parameters**:
  - `username` (string, required): The username to undelete.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "User 'someuser' has been successfully undeleted.",
  "data": {
    "username": "someuser",
    "is_deleted": false,
    "deleted_at": null
  },
  "meta": {
    "timestamp": "2026-01-22T10:26:00Z",
    "requestId": "req_12366"
  }
}
```

---

### Permanently Delete User

**Purpose**: Permanently deletes a user from the database. This is a destructive and irreversible action.
**Authentication**: Required (Admin role).
**Request**:
- **Method**: `DELETE`
- **URL**: `/api/users/admin/users/@:username/permanent`
- **URL Parameters**:
  - `username` (string, required): The username to permanently delete.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "User 'someuser' has been permanently deleted.",
  "data": null,
  "meta": {
    "timestamp": "2026-01-22T10:27:00Z",
    "requestId": "req_12367"
  }
}
```
**Error Response (409 Conflict)**:
```json
{
    "status": "error",
    "message": "Conflict: User cannot be deleted.",
    "error": {
        "code": "CONFLICT",
        "details": "This user cannot be deleted because they are referenced by other records (e.g., they own an organization or have made financial transactions)."
    }
}
```
---

## Organization Endpoints

Base Path: `/api/organizations`

### Health Check

**Purpose**: Verify that the organization router is running and accessible.
**Request**:
- **Method**: `GET`
- **URL**: `/api/organizations/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "Organization router running"
  },
  "meta": {
    "timestamp": "2026-01-22T10:29:00Z"
  }
}
```

---

### Get User Organizations

**Purpose**: Retrieves the organizations a specific user is a member of.
**Authentication**: Required.
**Request**:
- **Method**: `GET`
- **URL**: `/api/organizations/user/:userId`
- **URL Parameters**:
  - `userId` (string, required): The ID of the user.
**Response (200 OK)**:
```json
{
    "status": "success",
    "data": [
        {
            "id": "org-uuid-456",
            "name": "Awesome Devs",
            "slug": "awesome-devs",
            "role": "owner"
        }
    ],
    "meta": {
        "timestamp": "2026-01-22T10:30:00Z",
        "requestId": "req_12368"
    }
}
```
---

## Community Endpoints

Base Path: `/api/community`

All endpoints in this section require user authentication and email verification.

### Health Check

**Purpose**: Verify that the community router is running.
**Request**:
- **Method**: `GET`
- **URL**: `/api/community/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "Community router is running."
  },
  "meta": {
    "timestamp": "2026-01-22T10:31:00Z"
  }
}
```

---
### Spaces

Endpoints for managing community spaces.

#### Create Space

**Purpose**: Create a new community space. Can be linked to a specific game if the user has developer permissions for that game.
**Request**:
- **Method**: `POST`
- **URL**: `/api/community/spaces`
- **Body**:
```json
{
  "relatedGameId": "game-uuid-optional",
  "name": "General Discussion",
  "slug": "general-discussion",
  "description": "A place to talk about anything."
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "data": {
    "id": "space-uuid-1",
    "creatorId": "user-uuid-123",
    "relatedGameId": null,
    "name": "General Discussion",
    "slug": "general-discussion",
    "description": "A place to talk about anything.",
    "createdAt": "2026-01-22T10:32:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-22T10:32:00.000Z",
    "requestId": "req_12369"
  }
}
```

#### Get Space

**Purpose**: Retrieve a single space by its unique slug.
**Request**:
- **Method**: `GET`
- **URL**: `/api/community/spaces/:slug`
- **URL Parameters**:
  - `slug` (string, required): The slug of the space.
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "id": "space-uuid-1",
    "creatorId": "user-uuid-123",
    "relatedGameId": null,
    "name": "General Discussion",
    "slug": "general-discussion",
    "description": "A place to talk about anything.",
    "createdAt": "2026-01-22T10:32:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-22T10:33:00.000Z",
    "requestId": "req_12370"
  }
}
```

#### Update Space

**Purpose**: Update a space's details. Requires creator or developer permissions.
**Request**:
- **Method**: `PUT`
- **URL**: `/api/community/spaces/:id`
- **URL Parameters**:
  - `id` (string, required): The UUID of the space.
- **Body**:
```json
{
  "name": "Updated Name",
  "slug": "updated-slug",
  "description": "Updated description."
}
```
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Space updated successfully.",
  "data": {
    "id": "space-uuid-1",
    "name": "Updated Name",
    "slug": "updated-slug",
    "...": "..."
  }
}
```

#### Soft Delete Space

**Purpose**: Soft delete a space. Requires creator or developer permissions.
**Request**:
- **Method**: `DELETE`
- **URL**: `/api/community/spaces/:id`
- **URL Parameters**:
  - `id` (string, required): The UUID of the space.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Space deleted successfully.",
  "data": null
}
```

#### Undelete Space

**Purpose**: Restore a soft-deleted space. Requires creator or developer permissions.
**Request**:
- **Method**: `PUT`
- **URL**: `/api/community/spaces/:id/undelete`
- **URL Parameters**:
  - `id` (string, required): The UUID of the space.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Space undeleted successfully.",
  "data": null
}
```

---
### Posts

Endpoints for managing posts within spaces.

#### Create Post

**Purpose**: Create a new post in a specific space.
**Request**:
- **Method**: `POST`
- **URL**: `/api/community/posts`
- **Body**:
```json
{
  "space_id": "space-uuid-1",
  "title": "My First Post",
  "body": "This is the content of my post."
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Post created successfully.",
  "data": {
    "id": "post-uuid-1",
    "space_id": "space-uuid-1",
    "author_id": "user-uuid-123",
    "title": "My First Post",
    "body": "This is the content of my post.",
    "..." : "..."
  }
}
```

#### Get Post

**Purpose**: Retrieve a single post by its ID.
**Request**:
- **Method**: `GET`
- **URL**: `/api/community/posts/:id`
- **URL Parameters**:
  - `id` (string, required): The UUID of the post.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Post retrieved.",
  "data": {
    "id": "post-uuid-1",
    "title": "My First Post",
    "..." : "..."
  }
}
```

#### Get Posts by Space

**Purpose**: Retrieve all posts within a specific space.
**Request**:
- **Method**: `GET`
- **URL**: `/api/community/spaces/:space_slug/posts`
- **URL Parameters**:
  - `space_slug` (string, required): The slug of the space.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Posts retrieved.",
  "data": [
    {
      "id": "post-uuid-1",
      "title": "My First Post",
      "..." : "..."
    }
  ]
}
```

#### Update Post

**Purpose**: Update a post's title or body. Requires author or moderator permissions.
**Request**:
- **Method**: `PUT`
- **URL**: `/api/community/posts/:id`
- **URL Parameters**:
  - `id` (string, required): The UUID of the post.
- **Body**:
```json
{
  "title": "Updated Title",
  "body": "Updated content."
}
```
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Post updated successfully.",
  "data": {
    "id": "post-uuid-1",
    "title": "Updated Title",
    "..." : "..."
  }
}
```

#### Soft Delete Post

**Purpose**: Soft delete a post. Requires author or moderator permissions.
**Request**:
- **Method**: `DELETE`
- **URL**: `/api/community/posts/:id`
- **URL Parameters**:
  - `id` (string, required): The UUID of the post.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Post deleted successfully.",
  "data": null
}
```

#### Undelete Post

**Purpose**: Restore a soft-deleted post. Requires moderator permissions.
**Request**:
- **Method**: `PUT`
- **URL**: `/api/community/posts/:id/undelete`
- **URL Parameters**:
  - `id` (string, required): The UUID of the post.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Post undeleted successfully.",
  "data": null
}
```

---
### Comments

Endpoints for managing comments on posts.

#### Create Comment

**Purpose**: Create a new comment on a post, optionally as a reply to another comment.
**Request**:
- **Method**: `POST`
- **URL**: `/api/community/comments`
- **Body**:
```json
{
  "post_id": "post-uuid-1",
  "parent_comment_id": "comment-uuid-optional",
  "body": "This is a comment."
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Comment created successfully.",
  "data": {
    "id": "comment-uuid-1",
    "post_id": "post-uuid-1",
    "author_id": "user-uuid-123",
    "body": "This is a comment.",
    "..." : "..."
  }
}
```

#### Get Comments by Post

**Purpose**: Retrieve all comments for a specific post.
**Request**:
- **Method**: `GET`
- **URL**: `/api/community/posts/:post_id/comments`
- **URL Parameters**:
  - `post_id` (string, required): The UUID of the post.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Comments retrieved.",
  "data": [
    {
      "id": "comment-uuid-1",
      "body": "This is a comment.",
      "..." : "..."
    }
  ]
}
```

---
### Votes

Endpoints for upvoting and downvoting posts and comments.

#### Add/Update Post Vote

**Purpose**: Cast or change a vote on a post.
**Request**:
- **Method**: `POST`
- **URL**: `/api/community/posts/:post_id/vote`
- **URL Parameters**:
  - `post_id` (string, required): The UUID of the post.
- **Body**:
```json
{
  "value": 1
}
```
**Note**: `value` must be `1` (upvote) or `-1` (downvote).
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Vote added/updated successfully.",
  "data": {
    "post_id": "post-uuid-1",
    "user_id": "user-uuid-123",
    "value": 1
  }
}
```

#### Remove Post Vote

**Purpose**: Remove a user's vote from a post.
**Request**:
- **Method**: `DELETE`
- **URL**: `/api/community/posts/:post_id/vote`
- **URL Parameters**:
  - `post_id` (string, required): The UUID of the post.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Vote removed successfully.",
  "data": null
}
```

#### Add/Update Comment Vote

**Purpose**: Cast or change a vote on a comment.
**Request**:
- **Method**: `POST`
- **URL**: `/api/community/comments/:comment_id/vote`
- **URL Parameters**:
  - `comment_id` (string, required): The UUID of the comment.
- **Body**:
```json
{
  "value": -1
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Vote added/updated successfully.",
  "data": {
    "comment_id": "comment-uuid-1",
    "user_id": "user-uuid-123",
    "value": -1
  }
}
```

#### Remove Comment Vote

**Purpose**: Remove a user's vote from a comment.
**Request**:
- **Method**: `DELETE`
- **URL**: `/api/community/comments/:comment_id/vote`
- **URL Parameters**:
  - `comment_id` (string, required): The UUID of the comment.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Vote removed successfully.",
  "data": null
}
```
---

## Game Catalog Endpoints

Base Path: `/api/games`

All endpoints in this section require user authentication. Most write operations require specific permissions (e.g., being a developer in the game's organization).

### Health Check

**Purpose**: Verify that the game router is running.
**Request**:
- **Method**: `GET`
- **URL**: `/api/games/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "Game router is running."
  },
  "meta": {
    "timestamp": "2026-01-22T10:40:00Z"
  }
}
```

---
### Games

Endpoints for managing core game entries.

#### Create Game

**Purpose**: Create a new game within an organization. Requires developer permissions.
**Request**:
- **Method**: `POST`
- **URL**: `/api/games`
- **Body**:
```json
{
  "org_id": "org-uuid-456",
  "title": "My Awesome Game",
  "slug": "my-awesome-game",
  "description": "A game about awesomeness.",
  "status": "development"
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Game created successfully.",
  "data": {
    "id": "game-uuid-1",
    "org_id": "org-uuid-456",
    "title": "My Awesome Game",
    "slug": "my-awesome-game",
    "..." : "..."
  }
}
```

#### Get Game by Slug

**Purpose**: Retrieve a single game's details using the organization and game slugs.
**Request**:
- **Method**: `GET`
- **URL**: `/api/games/:org_slug/:game_slug`
- **URL Parameters**:
  - `org_slug` (string, required): The slug of the organization.
  - `game_slug` (string, required): The slug of the game.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Game retrieved.",
  "data": {
    "id": "game-uuid-1",
    "title": "My Awesome Game",
    "..." : "..."
  }
}
```

#### Get Organization Games

**Purpose**: Retrieve all games belonging to an organization.
**Request**:
- **Method**: `GET`
- **URL**: `/api/games/org/:org_slug`
- **URL Parameters**:
  - `org_slug` (string, required): The slug of the organization.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Games for organization retrieved.",
  "data": [
    {
      "id": "game-uuid-1",
      "title": "My Awesome Game",
      "..." : "..."
    }
  ]
}
```

---
### Game Versions & Assets

Endpoints for managing game versions and downloadable assets.

#### Create Game Version

**Purpose**: Create a new version for a game (e.g., v1.1, v1.2). Requires developer permissions.
**Request**:
- **Method**: `POST`
- **URL**: `/api/games/versions`
- **Body**:
```json
{
  "game_id": "game-uuid-1",
  "version_name": "1.1.0",
  "changelog": "Fixed bugs, added features.",
  "status": "published"
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Version created",
  "data": {
    "id": "version-uuid-1",
    "game_id": "game-uuid-1",
    "version_name": "1.1.0",
    "..." : "..."
  }
}
```

#### Create Game Asset

**Purpose**: Link a downloadable file (e.g., game build, DLC) to a game version. Requires developer permissions.
**Request**:
- **Method**: `POST`
- **URL**: `/api/games/assets`
- **Body**:
```json
{
  "version_id": "version-uuid-1",
  "asset_type": "windows_build",
  "storage_path": "path/to/my-game.zip",
  "file_name": "my-game-v1.1.zip",
  "file_size_bytes": 104857600,
  "checksum": "md5-or-sha256-hash"
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Asset created",
  "data": {
    "id": "asset-uuid-1",
    "version_id": "version-uuid-1",
    "asset_type": "windows_build",
    "..." : "..."
  }
}
```

---
### Tags

Endpoints for categorizing games with tags.

#### Get All Tags

**Purpose**: Retrieve a list of all available tags.
**Request**:
- **Method**: `GET`
- **URL**: `/api/games/tags`
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Tags retrieved",
  "data": [
    { "id": "tag-uuid-1", "name": "Indie" },
    { "id": "tag-uuid-2", "name": "RPG" }
  ]
}
```

#### Assign Tag to Game

**Purpose**: Assign an existing tag to a game. Requires developer permissions.
**Request**:
- **Method**: `POST`
- **URL**: `/api/games/tags/assign`
- **Body**:
```json
{
  "game_id": "game-uuid-1",
  "tag_id": "tag-uuid-1"
}
```
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Tag added to game",
  "data": null
}
```

---
### Reviews

Endpoints for user reviews of games.

#### Create Game Review

**Purpose**: Submit a new review for a game. Users cannot review their own games or review the same game twice.
**Request**:
- **Method**: `POST`
- **URL**: `/api/games/reviews`
- **Body**:
```json
{
  "game_id": "game-uuid-1",
  "rating": 5,
  "title": "Amazing Game!",
  "body": "I loved playing this game."
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Review created",
  "data": {
    "id": "review-uuid-1",
    "game_id": "game-uuid-1",
    "user_id": "user-uuid-123",
    "rating": 5,
    "..." : "..."
  }
}
```

#### Get Game Reviews

**Purpose**: Retrieve all reviews for a specific game.
**Request**:
- **Method**: `GET`
- **URL**: `/api/games/reviews/:game_id`
- **URL Parameters**:
  - `game_id` (string, required): The UUID of the game.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Reviews retrieved",
  "data": [
    {
      "id": "review-uuid-1",
      "rating": 5,
      "title": "Amazing Game!",
      "..." : "..."
    }
  ]
}
```
---

## Social Endpoints

Base Path: `/api/social`

All endpoints in this section require user authentication.

### Health Check

**Purpose**: Verify that the social router is running.
**Request**:
- **Method**: `GET`
- **URL**: `/api/social/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "Social router is running."
  },
  "meta": {
    "timestamp": "2026-01-22T10:50:00Z"
  }
}
```

---
### Follows

Endpoints for managing user follows.

#### Follow User

**Purpose**: Start following another user.
**Request**:
- **Method**: `POST`
- **URL**: `/api/social/follow`
- **Body**:
```json
{
  "user_id": "target-user-uuid-456"
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Successfully followed user",
  "data": {
    "follower_id": "current-user-uuid-123",
    "followed_id": "target-user-uuid-456",
    "created_at": "2026-01-22T10:51:00.000Z"
  }
}
```

#### Unfollow User

**Purpose**: Stop following another user.
**Request**:
- **Method**: `POST`
- **URL**: `/api/social/unfollow`
- **Body**:
```json
{
  "user_id": "target-user-uuid-456"
}
```
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Successfully unfollowed user",
  "data": null
}
```

---
### Conversations

Endpoints for managing user conversations and message requests.

#### Create Conversation

**Purpose**: Initiate a new conversation with another user. If users are already friends, the conversation starts as accepted; otherwise, it starts as pending.
**Request**:
- **Method**: `POST`
- **URL**: `/api/social/conversations`
- **Body**:
```json
{
  "recipient_id": "target-user-uuid-456"
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Successfully created conversation",
  "data": {
    "id": "conversation-uuid-1",
    "created_at": "2026-01-22T10:52:00.000Z"
  }
}
```

#### Get Conversations

**Purpose**: Retrieve all conversations for the authenticated user.
**Request**:
- **Method**: `GET`
- **URL**: `/api/social/conversations`
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Successfully retrieved conversations",
  "data": [
    {
      "conversation_id": "conversation-uuid-1",
      "participant_id": "current-user-uuid-123",
      "status": "accepted",
      "last_message_at": "2026-01-22T10:53:00.000Z",
      "other_participant": {
        "id": "target-user-uuid-456",
        "username": "recipientuser"
      }
    }
  ]
}
```

#### Get Message Requests

**Purpose**: Retrieve all pending message requests for the authenticated user.
**Request**:
- **Method**: `GET`
- **URL**: `/api/social/conversations/requests`
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Successfully retrieved message requests",
  "data": [
    {
      "conversation_id": "conversation-uuid-2",
      "status": "pending",
      "initiator": {
        "id": "initiator-user-uuid-789",
        "username": "initiatoruser"
      }
    }
  ]
}
```

#### Accept Message Request

**Purpose**: Accept a pending message request, changing the participant's status to 'accepted'.
**Request**:
- **Method**: `POST`
- **URL**: `/api/social/conversations/:conversation_id/accept`
- **URL Parameters**:
  - `conversation_id` (string, required): The UUID of the conversation.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Successfully accepted message request",
  "data": {
    "conversation_id": "conversation-uuid-2",
    "user_id": "current-user-uuid-123",
    "status": "accepted"
  }
}
```

---
### Messages

Endpoints for sending and retrieving messages within conversations.

#### Send Message
**Purpose**: Send a new message within an existing conversation.
**Request**:
- **Method**: `POST`
- **URL**: `/api/social/conversations/:conversation_id/messages`
- **URL Parameters**:
  - `conversation_id` (string, required): The UUID of the conversation.
- **Body**:
```json
{
  "body": "Hello there!"
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Successfully created message",
  "data": {
    "id": "message-uuid-1",
    "conversation_id": "conversation-uuid-1",
    "sender_id": "current-user-uuid-123",
    "body": "Hello there!",
    "created_at": "2026-01-22T10:54:00.000Z"
  }
}
```

#### Get Messages

**Purpose**: Retrieve all messages within a specific conversation.
**Request**:
- **Method**: `GET`
- **URL**: `/api/social/conversations/:conversation_id/messages`
- **URL Parameters**:
  - `conversation_id` (string, required): The UUID of the conversation.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Successfully retrieved messages",
  "data": [
    {
      "id": "message-uuid-1",
      "conversation_id": "conversation-uuid-1",
      "sender_id": "current-user-uuid-123",
      "body": "Hello there!",
      "created_at": "2026-01-22T10:54:00.000Z"
    }
  ]
}
```
---

## Notification Endpoints

Base Path: `/api/notifications`

All endpoints in this section require user authentication.

### Health Check

**Purpose**: Verify that the notification router is running.
**Request**:
- **Method**: `GET`
- **URL**: `/api/notifications/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "Notification router is running."
  },
  "meta": {
    "timestamp": "2026-01-22T11:00:00Z"
  }
}
```

---
### Notification Items

Endpoints for managing individual notifications.

#### Get Notifications

**Purpose**: Retrieve all notifications for the authenticated user (unread by default).
**Request**:
- **Method**: `GET`
- **URL**: `/api/notifications`
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Notifications retrieved",
  "data": [
    {
      "id": "notif-uuid-1",
      "recipientId": "user-uuid-123",
      "actorId": "user-uuid-456",
      "type": "NEW_FOLLOW",
      "data": { "followerUsername": "otheruser" },
      "read": false,
      "createdAt": "2026-01-22T10:59:00.000Z"
    }
  ]
}
```

#### Mark Notification as Read

**Purpose**: Mark a specific notification as read.
**Request**:
- **Method**: `PUT`
- **URL**: `/api/notifications/:id/read`
- **URL Parameters**:
  - `id` (string, required): The UUID of the notification.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Notification marked as read",
  "data": {
    "id": "notif-uuid-1",
    "recipientId": "user-uuid-123",
    "read": true
  }
}
```

#### Delete Notification

**Purpose**: Delete a specific notification.
**Request**:
- **Method**: `DELETE`
- **URL**: `/api/notifications/:id`
- **URL Parameters**:
  - `id` (string, required): The UUID of the notification.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Notification deleted",
  "data": null
}
```

---
### Notification Preferences

Endpoints for managing user notification settings.

#### Get Notification Preferences

**Purpose**: Retrieve the authenticated user's notification preferences.
**Request**:
- **Method**: `GET`
- **URL**: `/api/notifications/preferences`
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Notification preferences retrieved",
  "data": [
    {
      "userId": "user-uuid-123",
      "eventType": "NEW_FOLLOW",
      "emailEnabled": true,
      "pushEnabled": false
    },
    {
      "userId": "user-uuid-123",
      "eventType": "POST_LIKE",
      "emailEnabled": false,
      "pushEnabled": true
    }
  ]
}
```

#### Set Notification Preferences

**Purpose**: Set or update notification preferences for specific event types.
**Request**:
- **Method**: `POST`
- **URL**: `/api/notifications/preferences`
- **Body**:
```json
{
  "event_type": "NEW_FOLLOW",
  "email_enabled": false,
  "push_enabled": true
}
```
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Notification preferences updated",
  "data": {
    "userId": "user-uuid-123",
    "eventType": "NEW_FOLLOW",
    "emailEnabled": false,
    "pushEnabled": true
  }
}
```
---

## Analytics Endpoints

Base Path: `/api/analytics`

### Health Check

**Purpose**: Verify that the analytics router is running.
**Request**:
- **Method**: `GET`
- **URL**: `/api/analytics/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "Analytics router is running."
  },
  "meta": {
    "timestamp": "2026-01-22T11:10:00Z"
  }
}
```

---
### Record Telemetry Event

**Purpose**: Record a new telemetry event from a game or user session.
**Request**:
- **Method**: `POST`
- **URL**: `/api/analytics/events`
- **Body**:
```json
{
  "game_id": "game-uuid-1",
  "session_id": "session-uuid-123",
  "user_id": "user-uuid-456",
  "event_type": "level_start",
  "payload": {
    "level_name": "Forest of Shadows",
    "difficulty": "hard",
    "time_spent": 0
  }
}
```
**Note**: `game_id` and `event_type` are required.
**Response (201 Created)**:
```json
{
  "status": "success",
  "data": {
    "id": 1674393600000,
    "game_id": "game-uuid-1",
    "session_id": "session-uuid-123",
    "user_id": "user-uuid-456",
    "event_type": "level_start",
    "payload": {
      "level_name": "Forest of Shadows",
      "difficulty": "hard",
      "time_spent": 0
    },
    "recorded_at": "2026-01-22T11:11:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-22T11:11:00Z",
    "requestId": "req_12371"
  }
}
```
---

## Publishing Endpoints

Base Path: `/api/publishing`

All endpoints in this section require user authentication. Specific actions might require additional permissions (e.g., admin role, organization membership).

### Health Check

**Purpose**: Verify that the publishing router is running.
**Request**:
- **Method**: `GET`
- **URL**: `/api/publishing/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "Publishing router is running."
  },
  "meta": {
    "timestamp": "2026-01-22T11:20:00Z"
  }
}
```

---
### Categories

Endpoints for managing article categories.

#### Create Category

**Purpose**: Create a new category for articles.
**Authentication**: Required (Admin or Developer role).
**Request**:
- **Method**: `POST`
- **URL**: `/api/publishing/categories`
- **Body**:
```json
{
  "name": "Game Updates"
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Category created",
  "data": {
    "id": "category-uuid-1",
    "name": "Game Updates",
    "slug": "game-updates"
  }
}
```

#### Get All Categories

**Purpose**: Retrieve a list of all available article categories.
**Request**:
- **Method**: `GET`
- **URL**: `/api/publishing/categories`
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Categories retrieved",
  "data": [
    { "id": "category-uuid-1", "name": "Game Updates", "slug": "game-updates" },
    { "id": "category-uuid-2", "name": "Dev Blogs", "slug": "dev-blogs" }
  ]
}
```

---
### Articles

Endpoints for managing published articles.

#### Create Article

**Purpose**: Create a new article under an organization, optionally linked to a specific game. Requires appropriate organization membership (admin, owner, or developer).
**Request**:
- **Method**: `POST`
- **URL**: `/api/publishing/articles`
- **Body**:
```json
{
  "org_id": "org-uuid-456",
  "game_id": "game-uuid-1",
  "title": "New Game Feature Announcement",
  "summary": "Exciting new feature coming soon!",
  "body": "Detailed blog post content...",
  "cover_image_url": "https://example.com/cover.jpg",
  "category_id": "category-uuid-1",
  "is_published": true,
  "is_pinned": false
}
```
**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Article created successfully.",
  "data": {
    "id": "article-uuid-1",
    "author_id": "user-uuid-123",
    "org_id": "org-uuid-456",
    "title": "New Game Feature Announcement",
    "slug": "new-game-feature-announcement",
    "..." : "..."
  }
}
```

#### Get Article

**Purpose**: Retrieve a single article by its ID.
**Request**:
- **Method**: `GET`
- **URL**: `/api/publishing/articles/:id`
- **URL Parameters**:
  - `id` (string, required): The UUID of the article.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Article retrieved.",
  "data": {
    "id": "article-uuid-1",
    "title": "New Game Feature Announcement",
    "..." : "..."
  }
}
```

#### Get Articles by Organization

**Purpose**: Retrieve all articles published by a specific organization.
**Request**:
- **Method**: `GET`
- **URL**: `/api/publishing/organizations/:org_id/articles`
- **URL Parameters**:
  - `org_id` (string, required): The UUID of the organization.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Articles retrieved for organization.",
  "data": [
    {
      "id": "article-uuid-1",
      "title": "New Game Feature Announcement",
      "..." : "..."
    }
  ]
}
```

#### Update Article

**Purpose**: Update an existing article. Requires appropriate organization membership.
**Request**:
- **Method**: `PUT`
- **URL**: `/api/publishing/articles/:id`
- **URL Parameters**:
  - `id` (string, required): The UUID of the article.
- **Body**:
```json
{
  "title": "Updated Feature Announcement",
  "body": "Revised content..."
}
```
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Article updated successfully.",
  "data": {
    "id": "article-uuid-1",
    "title": "Updated Feature Announcement",
    "..." : "..."
  }
}
```

#### Delete Article

**Purpose**: Delete an article. Requires appropriate organization membership.
**Request**:
- **Method**: `DELETE`
- **URL**: `/api/publishing/articles/:id`
- **URL Parameters**:
  - `id` (string, required): The UUID of the article.
**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Article deleted successfully.",
  "data": null
}
```
---

## Financials Endpoints

Base Path: `/api/financials`

### Health Check

**Purpose**: Verify that the financial router is running.
**Request**:
- **Method**: `GET`
- **URL**: `/api/financials/health`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "PAYMENT WORKING"
  },
  "meta": {
    "timestamp": "2026-01-22T11:30:00Z"
  }
}
```

---
### Initialize Payment

**Purpose**: Initiates a payment process using the Chapa payment gateway.
**Authentication**: Required (User must be authenticated and email verified).
**Request**:
- **Method**: `POST`
- **URL**: `/api/financials/pay`
- **Body**:
```json
{
  "amount": 100,
  "currency": "ETB",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "checkout_url": "https://api.chapa.co/v1/transaction/checkout/url",
    "tx_ref": "tx-1674393600000"
  },
  "meta": {
    "timestamp": "2026-01-22T11:31:00Z",
    "requestId": "req_12372"
  }
}
```
---

### Verify Payment

**Purpose**: Verifies the status of a payment with the Chapa payment gateway. This is typically a callback URL Chapa redirects to.
**Request**:
- **Method**: `GET`
- **URL**: `/api/financials/verify-payment/:tx_ref`
- **URL Parameters**:
  - `tx_ref` (string, required): The transaction reference provided during payment initialization.
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "Payment verified successfully",
    "data": {
      "id": "chapa-transaction-id",
      "amount": 100,
      "currency": "ETB",
      "status": "success",
      "..." : "..."
    }
  },
  "meta": {
    "timestamp": "2026-01-22T11:32:00Z",
    "requestId": "req_12373"
  }
}
```
---

### Payment Success Callback

**Purpose**: A simple endpoint that Chapa redirects to after a successful payment.
**Request**:
- **Method**: `GET`
- **URL**: `/api/financials/payment-success`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "Payment successful!"
  },
  "meta": {
    "timestamp": "2026-01-22T11:33:00Z",
    "requestId": "req_12374"
  }
}
```
---

## Debug Endpoints

Base Path: `/api/debug`

These endpoints provide debugging and monitoring information. Access to these endpoints should be restricted in production environments.

### Get Debug Stats

**Purpose**: Provides a comprehensive snapshot of the system's operational status, including database health, server uptime, system memory/CPU usage, and key application statistics.
**Request**:
- **Method**: `GET`
- **URL**: `/api/debug/stats`
**Response (200 OK)**:
```json
{
  "timestamp": "2026-01-22T11:40:00.000Z",
  "total_users": 1500,
  "active_sessions": 42,
  "server_uptime": "15h 23m 45s",
  "process_uptime": "1h 5m 2s",
  "db_status": "healthy",
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
      {
        "address": "127.0.0.1",
        "netmask": "255.0.0.0",
        "family": "IPv4",
        "mac": "00:00:00:00:00:00",
        "internal": true,
        "cidr": "127.0.0.1/8"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-01-22T11:40:00Z",
    "requestId": "req_12375"
  }
}
```

---

### Database Test

**Purpose**: Executes a database test script to verify database connectivity and basic operations.
**Request**:
- **Method**: `GET`
- **URL**: `/api/debug/db-test`
**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "message": "Database test script executed successfully.",
    "stdout": "Database connection successful.\n",
    "stderr": ""
  },
  "meta": {
    "timestamp": "2026-01-22T11:41:00Z",
    "requestId": "req_12376"
  }
}
```
**Error Response (500 Internal Server Error)**:
```json
{
  "status": "error",
  "message": "Database test script execution failed.",
  "error": {
    "code": "DB_TEST_FAILED",
    "details": "Error message from script or server.",
    "output": {
      "stdout": "",
      "stderr": "Error: Connection refused.\n"
    }
  }
}
```
---
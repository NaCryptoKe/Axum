
# Community API

## Health Check

**Purpose:** Confirm the community router is running and check the basic API response structure.

**Request:**
- URL: `/api/community/health`
- Method: `GET`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Community router is running."
}
```

---

## Space Routes

### Create Space

**Purpose:** Creates a new community space.

**Request:**
- URL: `/api/community/spaces`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "related_game_id": "string (optional)",
  "name": "string (required)",
  "slug": "string (required)",
  "description": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Space created successfully.",
  "data": {
    "id": "string",
    "creator_id": "string",
    "related_game_id": "string",
    "name": "string",
    "slug": "string",
    "description": "string",
    "created_at": "date"
  }
}
```

### Get Space

**Purpose:** Retrieves a space by its slug.

**Request:**
- URL: `/api/community/spaces/:slug`
- Method: `GET`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Space retrieved.",
  "data": {
    "id": "string",
    "creator_id": "string",
    "related_game_id": "string",
    "name": "string",
    "slug": "string",
    "description": "string",
    "created_at": "date"
  }
}
```

### Update Space

**Purpose:** Updates a space's details.

**Request:**
- URL: `/api/community/spaces/:id`
- Method: `PUT`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "name": "string (optional)",
  "slug": "string (optional)",
  "description": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Space updated successfully.",
  "data": {
    "id": "string",
    "creator_id": "string",
    "related_game_id": "string",
    "name": "string",
    "slug": "string",
    "description": "string",
    "created_at": "date"
  }
}
```

### Soft Delete Space

**Purpose:** Soft deletes a space.

**Request:**
- URL: `/api/community/spaces/:id`
- Method: `DELETE`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Space deleted successfully."
}
```

### Undelete Space

**Purpose:** Undeletes a soft-deleted space.

**Request:**
- URL: `/api/community/spaces/:id/undelete`
- Method: `PUT`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Space undeleted successfully."
}
```

---

## Post Routes

### Create Post

**Purpose:** Creates a new post in a space.

**Request:**
- URL: `/api/community/posts`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "space_id": "string (required)",
  "title": "string (required)",
  "body": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully.",
  "data": {
    "id": "string",
    "space_id": "string",
    "author_id": "string",
    "title": "string",
    "body": "string",
    "created_at": "date"
  }
}
```

### Get Post

**Purpose:** Retrieves a post by its ID.

**Request:**
- URL: `/api/community/posts/:id`
- Method: `GET`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post retrieved.",
  "data": {
    "id": "string",
    "space_id": "string",
    "author_id": "string",
    "title": "string",
    "body": "string",
    "created_at": "date"
  }
}
```

### Get Posts By Space

**Purpose:** Retrieves all posts in a space.

**Request:**
- URL: `/api/community/spaces/:space_slug/posts`
- Method: `GET`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Posts retrieved.",
  "data": [
    {
      "id": "string",
      "space_id": "string",
      "author_id": "string",
      "title": "string",
      "body": "string",
      "created_at": "date"
    }
  ]
}
```

### Update Post

**Purpose:** Updates a post's details.

**Request:**
- URL: `/api/community/posts/:id`
- Method: `PUT`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "title": "string (optional)",
  "body": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post updated successfully.",
  "data": {
    "id": "string",
    "space_id": "string",
    "author_id": "string",
    "title": "string",
    "body": "string",
    "created_at": "date"
  }
}
```

### Soft Delete Post

**Purpose:** Soft deletes a post.

**Request:**
- URL: `/api/community/posts/:id`
- Method: `DELETE`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post deleted successfully."
}
```

### Undelete Post

**Purpose:** Undeletes a soft-deleted post.

**Request:**
- URL: `/api/community/posts/:id/undelete`
- Method: `PUT`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post undeleted successfully."
}
```

---

## Comment Routes

### Create Comment

**Purpose:** Creates a new comment on a post.

**Request:**
- URL: `/api/community/comments`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "post_id": "string (required)",
  "parent_comment_id": "string (optional)",
  "body": "string (required)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment created successfully.",
  "data": {
    "id": "string",
    "post_id": "string",
    "author_id": "string",
    "parent_comment_id": "string",
    "body": "string",
    "created_at": "date"
  }
}
```

### Get Comment

**Purpose:** Retrieves a comment by its ID.

**Request:**
- URL: `/api/community/comments/:id`
- Method: `GET`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment retrieved.",
  "data": {
    "id": "string",
    "post_id": "string",
    "author_id": "string",
    "parent_comment_id": "string",
    "body": "string",
    "created_at": "date"
  }
}
```

### Get Comments By Post

**Purpose:** Retrieves all comments for a post.

**Request:**
- URL: `/api/community/posts/:post_id/comments`
- Method: `GET`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comments retrieved.",
  "data": [
    {
      "id": "string",
      "post_id": "string",
      "author_id": "string",
      "parent_comment_id": "string",
      "body": "string",
      "created_at": "date"
    }
  ]
}
```

### Update Comment

**Purpose:** Updates a comment's body.

**Request:**
- URL: `/api/community/comments/:id`
- Method: `PUT`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "body": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment updated successfully.",
  "data": {
    "id": "string",
    "post_id": "string",
    "author_id": "string",
    "parent_comment_id": "string",
    "body": "string",
    "created_at": "date"
  }
}
```

### Soft Delete Comment

**Purpose:** Soft deletes a comment.

**Request:**
- URL: `/api/community/comments/:id`
- Method: `DELETE`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment and its replies deleted successfully."
}
```

### Undelete Comment

**Purpose:** Undeletes a soft-deleted comment.

**Request:**
- URL: `/api/community/comments/:id/undelete`
- Method: `PUT`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment undeleted successfully."
}
```

---

## Vote Routes

### Add Post Vote

**Purpose:** Adds an upvote or downvote to a post.

**Request:**
- URL: `/api/community/posts/:post_id/vote`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "value": "integer (1 for upvote, -1 for downvote)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Vote added/updated successfully.",
  "data": {
    "id": "string",
    "post_id": "string",
    "user_id": "string",
    "value": "integer"
  }
}
```

### Remove Post Vote

**Purpose:** Removes a user's vote from a post.

**Request:**
- URL: `/api/community/posts/:post_id/vote`
- Method: `DELETE`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Vote removed successfully."
}
```

### Add Comment Vote

**Purpose:** Adds an upvote or downvote to a comment.

**Request:**
- URL: `/api/community/comments/:comment_id/vote`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "value": "integer (1 for upvote, -1 for downvote)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Vote added/updated successfully.",
  "data": {
    "id": "string",
    "comment_id": "string",
    "user_id": "string",
    "value": "integer"
  }
}
```

### Remove Comment Vote

**Purpose:** Removes a user's vote from a comment.

**Request:**
- URL: `/api/community/comments/:comment_id/vote`
- Method: `DELETE`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Vote removed successfully."
}
```

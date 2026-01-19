To handle **News** (one-to-many broadcasts like game updates or studio announcements) and **Notifications** (one-to-one alerts like "User X followed you"), you should create two distinct areas. These have very different read/write patterns: News is written once and read by many; Notifications are written frequently and read by specific individuals.

Here is the SQL for these additions.

### 1. News & Articles Schema

This schema manages official content from developers or the platform itself. It links heavily to your `game_catalog` and `core.organizations`.

```sql
CREATE SCHEMA publishing;

-- Categories for news (e.g., 'Patch Notes', 'Dev Log', 'Sale', 'Press Release')
CREATE TABLE publishing.categories (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL UNIQUE,
    slug        TEXT NOT NULL UNIQUE
);

-- The Articles Table
CREATE TABLE publishing.articles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authoring & Ownership
    author_id       UUID REFERENCES core.users(id) ON DELETE SET NULL, -- The specific writer
    org_id          UUID REFERENCES core.organizations(id) ON DELETE CASCADE, -- The studio posting it
    game_id         UUID REFERENCES game_catalog.games(id) ON DELETE CASCADE, -- (Optional) Specific to a game
    
    -- Content
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
    summary         TEXT, -- Short blurb for cards/previews
    body            TEXT NOT NULL, -- Full HTML or Markdown content
    cover_image_url TEXT,
    
    -- Classification
    category_id     INT REFERENCES publishing.categories(id) ON DELETE SET NULL,
    
    -- Publishing Logic
    is_published    BOOLEAN NOT NULL DEFAULT false,
    published_at    TIMESTAMPTZ, -- Allows scheduling future posts
    is_pinned       BOOLEAN NOT NULL DEFAULT false, -- Pin to top of store page/feed
    
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Ensure unique slugs per organization to prevent URL collisions
    UNIQUE (org_id, slug)
);

```

### 2. Notifications Schema

This schema handles the alert stream for users. I have used a `JSONB` payload column here—this is best practice for notifications because the "data" you need changes based on the event type (e.g., a "Friend Request" needs a user ID, while a "Game Sale" needs a game ID and a price).

```sql
CREATE SCHEMA notifications;

-- Notification Types (Enum for code consistency)
CREATE TYPE notifications.event_type AS ENUM (
    'social_follow',         -- Someone followed you
    'social_msg_request',    -- You have a pending message
    'game_update',           -- A game in your library updated
    'wishlist_sale',         -- A game you want is on sale
    'system_alert',          -- Maintenance, bans, warnings
    'community_reply'        -- Someone replied to your post/comment
);

-- The Notification Inbox
CREATE TABLE notifications.items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id    UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    
    -- Who/What caused this? (Optional, as system alerts have no actor)
    actor_id        UUID REFERENCES core.users(id) ON DELETE SET NULL,
    
    -- What happened?
    type            notifications.event_type NOT NULL,
    
    -- Flexible Data: stores { "post_id": "...", "game_slug": "...", "preview_text": "..." }
    data            JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- State
    is_read         BOOLEAN NOT NULL DEFAULT false,
    read_at         TIMESTAMPTZ,
    
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notification Settings (Opt-out logic)
-- If a row exists here, the user DOES NOT want this type of notification.
CREATE TABLE notifications.preferences (
    user_id         UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    event_type      notifications.event_type NOT NULL,
    email_enabled   BOOLEAN NOT NULL DEFAULT true,  -- Receive email?
    push_enabled    BOOLEAN NOT NULL DEFAULT true,  -- Receive push/in-app?
    
    PRIMARY KEY (user_id, event_type)
);

```

### Integration Logic

Here is how these tables interact with your existing data:

1. **Sending Game News:**
* When an organization creates a row in `publishing.articles` linked to `game_catalog.games(id)`, you would trigger a background job.
* The job looks up everyone who has that game in `player_data.libraries`.
* The job inserts a row into `notifications.items` for each of those users with `type = 'game_update'`.


2. **Social Follows:**
* When User A follows User B (in the `social.follows` table discussed previously), you insert a row into `notifications.items`:
* `recipient_id`: User B
* `actor_id`: User A
* `type`: `'social_follow'`




3. **Performance Note:**
* The `notifications.items` table grows very fast. You should consider adding a **Partial Index** for unread items, as that is the query run on every page load:


```sql
CREATE INDEX idx_unread_notifs 
ON notifications.items(recipient_id) 
WHERE is_read = false;

```



**Next Step:** Would you like me to write a stored procedure (PL/pgSQL) that automatically creates a notification when a user receives a new message request?
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

CREATE INDEX idx_unread_notifs 
ON notifications.items(recipient_id) 
WHERE is_read = false;
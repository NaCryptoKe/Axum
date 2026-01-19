CREATE SCHEMA social;

-- 1. Follows (The base of your social graph)
-- "Friendship" is defined as: A follows B AND B follows A.
CREATE TABLE social.follows (
    follower_id     UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    following_id    UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    PRIMARY KEY (follower_id, following_id),
    -- Prevent self-following
    CONSTRAINT cannot_follow_self CHECK (follower_id <> following_id)
);

-- 2. Conversations
-- Groups messages. We add a type to distinguish DMs from Groups easily.
CREATE TABLE social.conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type            TEXT NOT NULL DEFAULT 'private' CHECK (type IN ('private', 'group')), 
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Conversation Participants & Approvals
-- This contains the "new column" you asked for: `request_status`.
CREATE TABLE social.conversation_participants (
    conversation_id UUID NOT NULL REFERENCES social.conversations(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    request_status  TEXT NOT NULL DEFAULT 'pending' CHECK (request_status IN ('pending', 'accepted', 'ignored')),
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_read_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (conversation_id, user_id)
);
-- "pending": The user sees this in "Message Requests" (cannot reply until accepted).
    -- "accepted": The user can see and reply freely.
    -- "ignored": The user hid the request.

-- 4. Messages (Standard structure)
CREATE TABLE social.messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES social.conversations(id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE SET NULL,
    body            TEXT NOT NULL CHECK (length(body) > 0),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
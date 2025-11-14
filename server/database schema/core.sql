CREATE SCHEMA core;

-- User Roles for authorization
CREATE TYPE core.user_role AS ENUM (
  'player',
  'creator',
  'moderator',
  'admin'
);
-- Organization Member Roles for permission scoping within an organization
CREATE TYPE core.org_member_role AS ENUM (
  'member',
  'moderator',
  'developer',
  'finance',
  'admin',
  'owner'
);

-- Main user table
CREATE TABLE core.users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstname       TEXT NOT NULL,
    lastname        TEXT NOT NULL,
    username        TEXT NOT NULL UNIQUE CHECK (username ~ '^[a-zA-Z0-9_]{3,30}$'),
    email           TEXT NOT NULL UNIQUE CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
    email_verified  BOOLEAN NOT NULL DEFAULT false,
    display_name    TEXT NOT NULL,
    hashed_password TEXT NULL,
    avatar_url      TEXT,
    bio             TEXT,
    role            core.user_role NOT NULL DEFAULT 'player',
    is_deleted      BOOLEAN NOT NULL DEFAULT false, -- Soft delete
    deleted_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- OTP for email verification
CREATE TABLE core.email_verifications (
    user_id     UUID PRIMARY KEY REFERENCES core.users(id) ON DELETE CASCADE,
    otp_hash    TEXT NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    attempts    SMALLINT NOT NULL DEFAULT 0
);

-- User sessions
CREATE TABLE core.sessions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    user_agent    TEXT,
    ip_address    INET,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at    TIMESTAMPTZ NOT NULL,
    browser       TEXT,
    device        TEXT
);

-- OAuth integration (e.g., Google, Discord login)
CREATE TABLE core.oauth_accounts (
    provider              TEXT NOT NULL,
    provider_account_id   TEXT NOT NULL,
    user_id               UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    PRIMARY KEY (provider, provider_account_id)
);

-- Password reset tokens
CREATE TABLE core.password_resets (
    token       TEXT PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_used     BOOLEAN NOT NULL DEFAULT false
);

-- Organizations (Dev studios, publishers)
CREATE TABLE core.organizations (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id                UUID NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT, -- Owner must exist
    name                    TEXT NOT NULL,
    slug                    TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    description             TEXT,
    website_url             TEXT,
    is_verified_developer   BOOLEAN NOT NULL DEFAULT false,
    is_deleted              BOOLEAN NOT NULL DEFAULT false,
    deleted_at              TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Many-to-many relationship for org membership
CREATE TABLE core.organization_members (
    org_id      UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    role        core.org_member_role NOT NULL DEFAULT 'member',
    joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (org_id, user_id)
);

-- Audit/Moderation log
CREATE TABLE core.moderation_actions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id            UUID REFERENCES core.users(id) ON DELETE SET NULL,
    target_user_id      UUID REFERENCES core.users(id) ON DELETE SET NULL,
    target_entity_type  TEXT,
    target_entity_id    UUID,
    action              TEXT NOT NULL,
    reason              TEXT,
    expires_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
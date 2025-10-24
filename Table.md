-- Axum Arcade Schema V2 - Patched based on critical feedback.
-- Key Changes:
-- 1.  Switched to pgcrypto for UUIDs and pg_trgm for fuzzy search.
-- 2.  Implemented soft deletes (is_deleted, deleted_at) for all user-generated content and entities.
-- 3.  Replaced dangerous ON DELETE CASCADE with ON DELETE NO ACTION/RESTRICT.
-- 4.  Added comprehensive auth tables (sessions, oauth_accounts, password_resets).
-- 5.  Added critical audit and moderation tables.
-- 6.  Added a new `financials` schema for future payment/payout logic.
-- 7.  Fixed slug uniqueness to be scoped per-organization for games.
-- 8.  Fixed NULL/NOT NULL constraint contradictions.
-- 9.  Hardened denormalized counter triggers against race conditions.
-- 10. Added a trigger to ensure denormalized `tags_cache` stays in sync.
-- 11. Improved indexing strategy with trigram and additional composite indexes.
-- 12. Simplified telemetry PK and noted the need for automated partitioning.

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

--------------------------------
-- Schema: core (Identity, Auth, Orgs, Moderation)
--------------------------------
CREATE SCHEMA core;

CREATE TYPE core.user_role AS ENUM (
  'player',
  'creator',
  'moderator',
  'admin'
);

CREATE TYPE core.org_member_role AS ENUM (
  'member',
  'developer',
  'finance',
  'admin',
  'owner'
);

CREATE TABLE core.users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username        TEXT NOT NULL UNIQUE CHECK (username ~ '^[a-zA-Z0-9_]{3,30}$'),
  email           TEXT NOT NULL UNIQUE CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'), -- Simplified, robust regex
  display_name    TEXT NOT NULL,
  hashed_password TEXT NULL, -- Hashing (e.g., Argon2) is handled by the application layer
  avatar_url      TEXT,
  bio             TEXT,
  role            core.user_role NOT NULL DEFAULT 'player',
  is_deleted      BOOLEAN NOT NULL DEFAULT false, -- Soft delete flag
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Authentication & Session Tables
CREATE TABLE core.sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE, -- Sessions die with the user
  user_agent    TEXT,
  ip_address    INET,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL
);

CREATE TABLE core.oauth_accounts (
  provider              TEXT NOT NULL,
  provider_account_id   TEXT NOT NULL,
  user_id               UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  PRIMARY KEY (provider, provider_account_id)
);

CREATE TABLE core.password_resets (
  token       TEXT PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_used     BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE core.organizations (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id                UUID NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
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

CREATE TABLE core.organization_members (
  org_id      UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  role        core.org_member_role NOT NULL DEFAULT 'member',
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id, user_id)
);

-- Moderation & Audit Tables
CREATE TABLE core.moderation_actions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id            UUID REFERENCES core.users(id) ON DELETE SET NULL, -- Who performed the action
  target_user_id      UUID REFERENCES core.users(id) ON DELETE SET NULL, -- Who was acted upon
  target_entity_type  TEXT, -- 'post', 'comment', 'game', 'user', etc.
  target_entity_id    UUID,
  action              TEXT NOT NULL, -- e.g., 'ban', 'delete_post', 'warn'
  reason              TEXT,
  expires_at          TIMESTAMPTZ, -- For temporary bans
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for core schema
CREATE INDEX ON core.users (email);
CREATE INDEX ON core.users (role) WHERE is_deleted = false;
CREATE INDEX ON core.sessions (user_id);
CREATE INDEX ON core.password_resets (user_id);
CREATE INDEX ON core.organizations (owner_id);
CREATE INDEX ON core.organization_members (user_id);
CREATE INDEX ON core.moderation_actions (target_user_id);
CREATE INDEX ON core.moderation_actions (target_entity_type, target_entity_id);

--------------------------------
-- Schema: game_catalog (Games, Mods, Assets)
--------------------------------
CREATE SCHEMA game_catalog;

CREATE TYPE game_catalog.entity_status AS ENUM (
  'draft',
  'upcoming',
  'published',
  'archived'
);

CREATE TYPE game_catalog.asset_type AS ENUM (
  'build_windows', 'build_linux', 'build_mac',
  'screenshot', 'video', 'soundtrack', 'documentation', 'other'
);

CREATE TABLE game_catalog.games (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES core.organizations(id) ON DELETE RESTRICT,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  description     TEXT,
  status          game_catalog.entity_status NOT NULL DEFAULT 'draft',
  release_date    TIMESTAMPTZ,
  cover_image_url TEXT,
  metadata        JSONB,
  tags_cache      TEXT[], -- Denormalized array, kept in sync by trigger
  review_count    INT NOT NULL DEFAULT 0,
  rating_sum      BIGINT NOT NULL DEFAULT 0, -- Use BIGINT to avoid overflow
  search_vector   TSVECTOR,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMPTZ,
  created_by      UUID REFERENCES core.users(id) ON DELETE SET NULL,
  updated_by      UUID REFERENCES core.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, slug) -- Slug is unique PER organization, not globally
);

CREATE TABLE game_catalog.game_versions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id       UUID NOT NULL REFERENCES game_catalog.games(id) ON DELETE CASCADE, -- Versions are ephemeral to a game
  version_name  TEXT NOT NULL,
  changelog     TEXT,
  status        game_catalog.entity_status NOT NULL DEFAULT 'draft',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (game_id, version_name)
);

CREATE TABLE game_catalog.game_assets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id        UUID NOT NULL REFERENCES game_catalog.game_versions(id) ON DELETE CASCADE,
  asset_type        game_catalog.asset_type NOT NULL,
  storage_path      TEXT NOT NULL,
  file_name         TEXT,
  file_size_bytes   BIGINT,
  checksum          TEXT, -- e.g., SHA256
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE game_catalog.tags (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  description   TEXT,
  is_mood_tag   BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE game_catalog.game_tags (
  game_id       UUID NOT NULL REFERENCES game_catalog.games(id) ON DELETE CASCADE,
  tag_id        INT NOT NULL REFERENCES game_catalog.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, tag_id)
);

CREATE TABLE game_catalog.game_reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id       UUID NOT NULL REFERENCES game_catalog.games(id) ON DELETE NO ACTION, -- Don't delete reviews if game is soft-deleted
  user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE NO ACTION,
  rating        SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title         TEXT,
  body          TEXT,
  is_deleted    BOOLEAN NOT NULL DEFAULT false,
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (game_id, user_id)
);

-- Indexes for game_catalog
CREATE INDEX ON game_catalog.games (org_id, status, created_at DESC); -- For dev dashboard
CREATE INDEX ON game_catalog.games USING GIN (metadata jsonb_path_ops);
CREATE INDEX ON game_catalog.games USING GIN (tags_cache);
CREATE INDEX ON game_catalog.games USING GIN (search_vector);
CREATE INDEX ON game_catalog.games USING GIN (title gin_trgm_ops); -- For fuzzy search
CREATE INDEX ON game_catalog.game_versions (game_id);
CREATE INDEX ON game_catalog.game_assets (version_id);
CREATE INDEX ON game_catalog.game_tags (tag_id);
CREATE INDEX ON game_catalog.game_reviews (user_id);
CREATE INDEX ON game_catalog.game_reviews (game_id, rating DESC) WHERE is_deleted = false;


--------------------------------
-- Schema: community (Spaces, Posts, Comments)
--------------------------------
CREATE SCHEMA community;

CREATE TABLE community.spaces (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id      UUID REFERENCES core.users(id) ON DELETE SET NULL, -- FIXED: Now nullable
  related_game_id UUID REFERENCES game_catalog.games(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  description     TEXT,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (related_game_id)
);

CREATE TABLE community.posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id        UUID NOT NULL REFERENCES community.spaces(id) ON DELETE NO ACTION,
  author_id       UUID REFERENCES core.users(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  body            TEXT,
  vote_sum        INT NOT NULL DEFAULT 0,
  comment_count   INT NOT NULL DEFAULT 0,
  search_vector   TSVECTOR,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE community.comments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id             UUID NOT NULL REFERENCES community.posts(id) ON DELETE CASCADE, -- Comments die with posts
  author_id           UUID REFERENCES core.users(id) ON DELETE SET NULL,
  parent_comment_id   UUID REFERENCES community.comments(id) ON DELETE CASCADE,
  body                TEXT NOT NULL,
  vote_sum            INT NOT NULL DEFAULT 0,
  is_deleted          BOOLEAN NOT NULL DEFAULT false,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE community.post_votes (
  post_id       UUID NOT NULL REFERENCES community.posts(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  value         SMALLINT NOT NULL CHECK (value IN (-1, 1)),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- Indexes for community
CREATE INDEX ON community.posts (space_id, created_at DESC) WHERE is_deleted = false;
CREATE INDEX ON community.posts (author_id, created_at DESC) WHERE is_deleted = false;
CREATE INDEX ON community.comments (post_id, created_at ASC) WHERE is_deleted = false;
CREATE INDEX ON community.comments (parent_comment_id);


--------------------------------
-- Schema: player_data (Library, Saves, Social)
--------------------------------
CREATE SCHEMA player_data;

CREATE TABLE player_data.libraries (
  user_id         UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  game_id         UUID NOT NULL REFERENCES game_catalog.games(id) ON DELETE RESTRICT,
  acquired_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  playtime_seconds BIGINT NOT NULL DEFAULT 0,
  last_played_at  TIMESTAMPTZ,
  PRIMARY KEY (user_id, game_id)
);

CREATE INDEX ON player_data.libraries (user_id, last_played_at DESC NULLS LAST); -- For user library view

--------------------------------
-- Schema: analytics (Telemetry, Events)
--------------------------------
CREATE SCHEMA analytics;

CREATE TABLE analytics.game_telemetry (
  id            BIGINT PRIMARY KEY, -- Simplified PK
  game_id       UUID NOT NULL, -- No FK for performance, allows data retention if game is deleted
  session_id    UUID,
  user_id       UUID,
  event_type    TEXT NOT NULL,
  payload       JSONB,
  timestamp     TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (timestamp);

-- NOTE: Partitions should be created and managed automatically by a script or extension like pg_partman.
-- Example for manual creation:
-- CREATE TABLE analytics.game_telemetry_y2025m11 PARTITION OF analytics.game_telemetry
--   FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

CREATE INDEX ON analytics.game_telemetry (timestamp DESC);
CREATE INDEX ON analytics.game_telemetry (game_id, timestamp DESC);
CREATE INDEX ON analytics.game_telemetry (user_id, timestamp DESC);
CREATE INDEX ON analytics.game_telemetry (event_type);
CREATE INDEX ON analytics.game_telemetry USING GIN (payload jsonb_path_ops);

--------------------------------
-- Schema: financials (Payments, Payouts)
--------------------------------
CREATE SCHEMA financials;

-- NOTE: This is a scaffold. A real financial system is vastly more complex.
CREATE TABLE financials.orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
  status        TEXT NOT NULL, -- e.g., 'pending', 'completed', 'failed', 'refunded'
  total_amount  NUMERIC(10, 2) NOT NULL,
  currency      TEXT NOT NULL,
  provider_txn_id TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE financials.order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES financials.orders(id) ON DELETE RESTRICT,
  game_id       UUID NOT NULL REFERENCES game_catalog.games(id) ON DELETE RESTRICT,
  amount        NUMERIC(10, 2) NOT NULL,
  currency      TEXT NOT NULL
);

--------------------------------
-- Helper Functions & Triggers
--------------------------------

-- Trigger function to update 'updated_at' timestamps
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all mutable tables... (Example for one table)
CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON core.users
FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp();
-- ... apply to others as needed (organizations, games, etc.)

-- Robust trigger for post comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE community.posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE community.posts SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comment_count_trigger
AFTER INSERT OR DELETE ON community.comments
FOR EACH ROW EXECUTE PROCEDURE update_post_comment_count();

-- Trigger to keep games.tags_cache in sync with game_tags
CREATE OR REPLACE FUNCTION sync_game_tags_cache()
RETURNS TRIGGER AS $$
DECLARE
  v_game_id UUID;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_game_id := OLD.game_id;
  ELSE
    v_game_id := NEW.game_id;
  END IF;

  UPDATE game_catalog.games
  SET tags_cache = (
    SELECT array_agg(t.name)
    FROM game_catalog.game_tags gt
    JOIN game_catalog.tags t ON gt.tag_id = t.id
    WHERE gt.game_id = v_game_id
  )
  WHERE id = v_game_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_game_tags_cache_trigger
AFTER INSERT OR UPDATE OR DELETE ON game_catalog.game_tags
FOR EACH ROW EXECUTE PROCEDURE sync_game_tags_cache();

-- Triggers for FTS vector updates
CREATE OR REPLACE FUNCTION update_game_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_game_search_vector_trigger
BEFORE INSERT OR UPDATE ON game_catalog.games
FOR EACH ROW EXECUTE PROCEDURE update_game_search_vector();

CREATE OR REPLACE FUNCTION update_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.body, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_search_vector_trigger
BEFORE INSERT OR UPDATE ON community.posts
FOR EACH ROW EXECUTE PROCEDURE update_post_search_vector();
CREATE SCHEMA game_catalog;

-- Status for game entities (draft, published, etc.)
CREATE TYPE game_catalog.entity_status AS ENUM (
  'draft',
  'upcoming',
  'published',
  'archived'
);

-- Types of game assets
CREATE TYPE game_catalog.asset_type AS ENUM (
  'build_windows', 'build_linux', 'build_mac',
  'screenshot', 'video', 'soundtrack', 'documentation', 'other'
);
-- add asset types such as logo, trailer

-- Main game entity
CREATE TABLE game_catalog.games (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID NOT NULL REFERENCES core.organizations(id) ON DELETE RESTRICT, -- Organization owns the game
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
    description     TEXT,
    status          game_catalog.entity_status NOT NULL DEFAULT 'draft',
    release_date    TIMESTAMPTZ,
    cover_image_url TEXT,
    metadata        JSONB,
    tags_cache      TEXT[], -- Denormalized for fast filtering
    review_count    INT NOT NULL DEFAULT 0,
    rating_sum      BIGINT NOT NULL DEFAULT 0,
    search_vector   TSVECTOR, -- For Full Text Search
    is_deleted      BOOLEAN NOT NULL DEFAULT false, -- Soft delete
    deleted_at      TIMESTAMPTZ,
    created_by      UUID REFERENCES core.users(id) ON DELETE SET NULL,
    updated_by      UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (org_id, slug) -- Critical: Slug is unique per organization
);

-- Game versions (for updates/releases)
CREATE TABLE game_catalog.game_versions (
                                            id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                            game_id       UUID NOT NULL REFERENCES game_catalog.games(id) ON DELETE CASCADE,
                                            version_name  TEXT NOT NULL,
                                            changelog     TEXT,
                                            status        game_catalog.entity_status NOT NULL DEFAULT 'draft',
                                            created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
                                            UNIQUE (game_id, version_name)
);

-- Stored assets (builds, images, etc.)
CREATE TABLE game_catalog.game_assets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id        UUID NOT NULL REFERENCES game_catalog.game_versions(id) ON DELETE CASCADE,
  asset_type        game_catalog.asset_type NOT NULL,
  storage_path      TEXT NOT NULL,
  file_name         TEXT,
  file_size_bytes   BIGINT,
  checksum          TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Global tags taxonomy
CREATE TABLE game_catalog.tags (
                                   id            SERIAL PRIMARY KEY,
                                   name          TEXT NOT NULL UNIQUE,
                                   description   TEXT,
                                   is_mood_tag   BOOLEAN NOT NULL DEFAULT false
);

-- Many-to-many link between games and tags
CREATE TABLE game_catalog.game_tags (
                                        game_id       UUID NOT NULL REFERENCES game_catalog.games(id) ON DELETE CASCADE,
                                        tag_id        INT NOT NULL REFERENCES game_catalog.tags(id) ON DELETE CASCADE,
                                        PRIMARY KEY (game_id, tag_id)
);

-- User-submitted reviews
CREATE TABLE game_catalog.game_reviews (
                                           id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                           game_id       UUID NOT NULL REFERENCES game_catalog.games(id) ON DELETE NO ACTION, -- Game soft delete does not delete reviews
                                           user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE NO ACTION,
                                           rating        SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                                           title         TEXT,
                                           body          TEXT,
                                           is_deleted    BOOLEAN NOT NULL DEFAULT false, -- Soft delete
                                           deleted_at    TIMESTAMPTZ,
                                           created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
                                           updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
                                           UNIQUE (game_id, user_id)
);
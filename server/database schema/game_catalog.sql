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
  'screenshot', 'video', 'soundtrack', 'documentation', 'other',
  'logo', 'trailer'
);

-- Main game entity
CREATE TABLE game_catalog.games(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  status entity_status NOT NULL DEFAULT 'draft'::entity_status,
  release_date timestamp with time zone,
  cover_image_url text,
  metadata jsonb,
  tags_cache text[],
  review_count integer NOT NULL DEFAULT 0,
  rating_sum bigint NOT NULL DEFAULT 0,
  search_vector tsvector,
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamp with time zone,
  created_by uuid,
  updated_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  price double precision NOT NULL DEFAULT 0,
  downloads bigint DEFAULT 0,
  PRIMARY KEY(id),
  CONSTRAINT games_org_id_fkey FOREIGN key(org_id) REFERENCES organizations(id),
  CONSTRAINT games_created_by_fkey FOREIGN key(created_by) REFERENCES users(id),
  CONSTRAINT games_updated_by_fkey FOREIGN key(updated_by) REFERENCES users(id),
  CONSTRAINT games_slug_check CHECK ((slug ~ '^[a-z0-9-]+$'::text))
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
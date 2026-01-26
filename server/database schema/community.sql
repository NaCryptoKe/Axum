CREATE SCHEMA community;

-- Discussion spaces (e.g., forums for a game or general topics)
CREATE TABLE community.spaces (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id      UUID REFERENCES core.users(id) ON DELETE SET NULL,
  related_game_id UUID REFERENCES game_catalog.games(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES core.organizations(id) ON DELETE SET NULL, -- For official vs. fan spaces
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  description     TEXT,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (related_game_id) -- Only one space per game
);

-- Main user-generated posts
CREATE TABLE community.posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id        UUID NOT NULL REFERENCES community.spaces(id) ON DELETE NO ACTION, -- Soft delete won't auto-delete posts
  author_id       UUID REFERENCES core.users(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  body            TEXT,
  vote_sum        INT NOT NULL DEFAULT 0, -- Denormalized counter
  comment_count   INT NOT NULL DEFAULT 0, -- Denormalized counter
  search_vector   TSVECTOR,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_locked       BOOLEAN NOT NULL DEFAULT false
);

-- Nested comments on posts
CREATE TABLE community.comments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id             UUID NOT NULL REFERENCES community.posts(id) ON DELETE CASCADE, -- Comments belong strictly to a post
  author_id           UUID REFERENCES core.users(id) ON DELETE SET NULL,
  parent_comment_id   UUID REFERENCES community.comments(id) ON DELETE CASCADE, -- For nesting
  body                TEXT NOT NULL,
  vote_sum            INT NOT NULL DEFAULT 0,
  is_deleted          BOOLEAN NOT NULL DEFAULT false,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Voting on posts (upvote/downvote)
CREATE TABLE community.post_votes (
  post_id       UUID NOT NULL REFERENCES community.posts(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  value         SMALLINT NOT NULL CHECK (value IN (-1, 1)),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- Voting on comments (upvote/downvote)
CREATE TABLE community.comment_votes (
  comment_id    UUID NOT NULL REFERENCES community.comments(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  value         SMALLINT NOT NULL CHECK (value IN (-1, 1)),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (comment_id, user_id)
);
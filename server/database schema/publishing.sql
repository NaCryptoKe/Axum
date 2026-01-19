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
CREATE SCHEMA financials;

-- Top-level order entity
CREATE TABLE financials.orders (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT, -- User must exist
    status        TEXT NOT NULL,
    total_amount  NUMERIC(10, 2) NOT NULL,
    currency      TEXT NOT NULL,
    provider_txn_id TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Items within an order (e.g., games purchased)
CREATE TABLE financials.order_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id      UUID NOT NULL REFERENCES financials.orders(id) ON DELETE RESTRICT,
    game_id       UUID NOT NULL REFERENCES game_catalog.games(id) ON DELETE RESTRICT, -- Game must exist
    amount        NUMERIC(10, 2) NOT NULL,
    currency      TEXT NOT NULL
);
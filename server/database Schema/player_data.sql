CREATE SCHEMA player_data;

-- User's game library (i.e., which games they own/have access to)
CREATE TABLE player_data.libraries (
                                       user_id         UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE, -- Library dies with the user
                                       game_id         UUID NOT NULL REFERENCES game_catalog.games(id) ON DELETE RESTRICT, -- Game deletion doesn't erase library entry
                                       acquired_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
                                       playtime_seconds BIGINT NOT NULL DEFAULT 0,
                                       last_played_at  TIMESTAMPTZ,
                                       PRIMARY KEY (user_id, game_id)
);
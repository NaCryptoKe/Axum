CREATE SCHEMA analytics;

-- Table for storing high-volume game/user events
CREATE TABLE analytics.game_telemetry (
    id            BIGINT NOT NULL, -- PK component 1
    game_id       UUID NOT NULL, -- No FK for performance, for decoupling
    session_id    UUID,
    user_id       UUID,
    event_type    TEXT NOT NULL,
    payload       JSONB,
    timestamp     TIMESTAMPTZ NOT NULL DEFAULT now(), -- PK component 2 (the partition key)

    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);
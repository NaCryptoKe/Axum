-- SQL schema for the Axum Arcade database (PostgreSQL version)

-- Create the database
CREATE DATABASE axum_arcade;

\c axum_arcade  -- Connect to the database

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar_url VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Games table
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    short_description VARCHAR(255),
    cover_url VARCHAR(255),
    file_url VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    file_size BIGINT DEFAULT 0,
    version VARCHAR(20),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    download_count INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Game-Categories join table
CREATE TABLE game_categories (
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, category_id)
);

-- Purchases table
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    purchase_type VARCHAR(20) NOT NULL CHECK (purchase_type IN ('bought','claimed')),
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_no VARCHAR(255) UNIQUE,
    UNIQUE(user_id, game_id)
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(100),
    content TEXT,
    is_verified_owner BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_title ON games(title);
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);
CREATE INDEX idx_sessions_expire ON sessions(expire);
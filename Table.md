-- SQL schema for the Axum Arcade database.

CREATE DATABASE axum_arcade;
USE axum_arcade;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
email_verified BOOLEAN DEFAULT FALSE,
is_admin BOOLEAN DEFAULT FALSE,
avatar_url VARCHAR(255),
bio TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
last_login TIMESTAMP NULL
);

CREATE TABLE games (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
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
status ENUM('draft', 'pending', 'approved', 'rejected') DEFAULT 'pending',
rejection_reason TEXT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE categories (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) UNIQUE NOT NULL,
description TEXT
);

CREATE TABLE game_categories (
game_id INT,
category_id INT,
PRIMARY KEY (game_id, category_id),
FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE purchases (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
game_id INT NOT NULL,
purchase_type ENUM('bought', 'claimed') NOT NULL,
amount_paid DECIMAL(10,2) DEFAULT 0.00,
purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
transaction_no VARCHAR(255) NULL UNIQUE,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
UNIQUE KEY unique_user_game (user_id, game_id)
);

CREATE TABLE reviews (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
game_id INT,
rating INT CHECK (rating >= 1 AND rating <= 5),
title VARCHAR(100),
content TEXT,
is_verified_owner BOOLEAN DEFAULT FALSE,
helpful_count INT DEFAULT 0,
status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
UNIQUE KEY unique_user_game_review (user_id, game_id)
);

CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_title ON games(title);
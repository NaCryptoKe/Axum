# 🗂️ Schema Overview and Achievements

This database is built to be **modern, scalable, and secure**, following best practices in schema design.  
Key goals include:

- **Soft deletes** for safe data management
- **Robust authentication and authorization**
- **Optimized indexing** (including **trigram** and **GIN** for JSONB / FTS)
- **Denormalization** where performance demands it
- **Hardened triggers** for consistency and speed
- **No automatic cascades** — critical entities like `organizations` and `games` use  
  `ON DELETE NO ACTION` or `RESTRICT` to prevent accidental data loss and maintain historical integrity

> 💾 Each schema folder contains its corresponding `.sql` file that defines and sets up that specific schema.

---

## 🔐 `core` Schema — Identity, Auth, Orgs, Moderation

Handles:
- User identity and authentication
- Role-based authorization
- Organization and team management
- Moderation and system-level controls

🧩 **File:** `/core.sql`

---

## 🎮 `game_catalog` Schema — Games, Mods, Assets

Manages the platform’s primary content:
- Game records, builds, and versions
- Mods and associated assets (builds, screenshots, etc.)
- Tags, reviews, and metadata

🧩 **File:** `/game_catalog.sql`

---

## 💬 `community` Schema — Spaces, Posts, Comments

Facilitates all user-generated content and interaction:
- Discussion spaces
- Posts and threaded comments
- Voting and community engagement mechanisms

🧩 **File:** `/community.sql`

---

## 👤 `player_data` Schema — Library, Saves, Social

Stores user-specific data:
- Game library and ownership
- Playtime statistics
- Future expansion for game saves and social connections

🧩 **File:** `/player_data.sql`

---

## 📈 `analytics` Schema — Telemetry, Events

Dedicated to handling large-scale telemetry and tracking:
- Game telemetry and user activity events
- Optimized for time-series storage
- Uses **declarative table partitioning** for performance and scalability

🧩 **File:** `/analytics.sql`

---

## 💰 `financials` Schema — Payments, Payouts

Scaffold for all financial operations:
- User and game transaction tracking
- Payment processing and payouts
- Simple but extensible design for future e-commerce integration

🧩 **File:** `/financials.sql`

---

**✅ Summary:**  
This architecture enforces **data safety**, **performance**, and **extensibility** — each schema is modular, clearly documented, and optimized for both developer experience and system longevity.

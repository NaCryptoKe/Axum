# 🚀 Quickstart Guide

## 1. Installation

First, make sure you have both **Node.js** and **PostgreSQL** installed.

Run the database schema scripts found in the **`/database schema`** folder.  
If you get stuck, there’s a README in that directory to walk you through it.

Then, install all project dependencies by running:

```bash
npm install
```

Run that command both in the root directory and inside the /client directory.

---

## 2. Tech Stack

| **Technology** | **Version**                       |
|----------------|-----------------------------------|
| Node.js/Express| node: `v22.20.0+`, npm: `10.9.3+` |
| PostgreSQL | `16.9+` |

---

## 3. Folder Structure

`/server` the Root for the backend

The core backend folder; Everything lives here.
```pgsql
/server
│
├── config/                  # All configuration files (e.g., DB connection)
│
├── controllers/             # Handles route logic; talks to models and returns responses
│
├── database schema/         # Contains DB structure, design decisions, and documentation
│
├── middlewares/             # Global middlewares (e.g., tracking URLs, updating last seen)
│
├── models/                  # Database representations; interacts directly with the DB
│
├── routes/                  # API routes connected to controllers
│
├── utils/                   # Helper functions used across the app
│
├── server.js                # Entry point — start with `npm start`
│
├── External (API) Documentation/   # Docs for third-party API users
│
└── Internal (System) Documentation/ # Docs for internal backend & frontend devs
```

---

## 4. Run the server

Once setup is complete, start the backend with:
```bash
npm start
```

That’s it, your server should now be running smoothly! 😁
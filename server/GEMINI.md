# Gemini Project: Axum Backend

## Project Overview

This project is the backend server for Axum, a web application built with Node.js and Express. It serves as the API for the application, handling data, authentication, and business logic. The server uses a PostgreSQL database to store its data.

The project is structured in a way that separates concerns, with distinct folders for routes, controllers, models, and middlewares. This makes the codebase modular and easier to maintain.

### Key Technologies

*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL
*   **Authentication:** JWT, Passport.js (with Google OAuth), bcrypt, argon2
*   **Development:** Nodemon for automatic server restarts

## Building and Running

### 1. Prerequisites

*   Node.js (v22.20.0+)
*   npm (v10.9.3+)
*   PostgreSQL (v16.9+)

### 2. Database Setup

Before running the server, you need to set up the database. The necessary SQL scripts are located in the `/database schema` directory. Please refer to the `README.md` file within that directory for detailed instructions on how to set up the database.

### 3. Install Dependencies

To install the required Node.js packages, run the following command in the project's root directory:

```bash
npm install
```

### 4. Running the Server

To start the development server, run:

```bash
npm start
```

This will start the server using `nodemon`, which will automatically restart the server whenever you make changes to the code.

## Development Conventions

*   **MVC-like Architecture:** The project follows a structure similar to the Model-View-Controller (MVC) pattern:
    *   **Models:** Located in the `/models` directory, these files are responsible for interacting with the PostgreSQL database.
    *   **Controllers:** Located in the `/controllers` directory, these files contain the business logic for each route.
    *   **Routes:** Located in the `/routes` directory, these files define the API endpoints and connect them to the appropriate controller functions.
*   **Middleware:** The `/middlewares` directory contains functions that are used to intercept and process requests before they reach the controllers. This is used for tasks like authentication, rate limiting, and logging.
*   **Utilities:** The `/utils` directory contains helper functions that can be reused across the application.
*   **Database Schema:** The `/database schema` directory contains the SQL scripts for creating the database schema. This is a good practice for keeping track of the database structure and for setting up new development environments.
*   **Documentation:** The project has two documentation files: `External (API) Documentation.md` and `Internal (System) Documentation.md`. This is a great practice for keeping the project well-documented.

# STRICT GUIDELINES

- Never USE EMOJIS for anything
- Make comments make sense but don't bloat
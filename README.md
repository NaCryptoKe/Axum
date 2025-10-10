
---

## Database Schema

The database consists of tables for:

- Users
- Games
- Categories
- Purchases
- Reviews
- Moderation Actions  

The full schema is available in [`Table.md`](Table.md).

---

## Setup Instructions

### Database Setup

1. Create a MySQL database named `axum_arcade`.
2. Import the schema from the `Table.md` file.
3. Update the database credentials in `app/config/db.php`.

### Web Server Configuration

1. Configure your web server (Apache, Nginx, etc.) to use the `public` directory as the document root.
2. Enable URL rewriting (e.g., `mod_rewrite` for Apache) so the front controller (`index.php`) handles all requests.

### API Keys

1. Obtain a **Google Gemini API key**.
2. Add the API key to `app/config/chat_handler.php`.

### Dependencies

- PHP `curl` extension is required for API requests. Ensure it is installed and enabled.

### Running the Application

Once configured, access the application through your web server URL.

---

## How to Contribute

Contributions are welcome! You can:

- Submit a **pull request**.
- Open an **issue** for bugs or feature requests.

Please follow standard coding conventions and add clear commit messages.

---
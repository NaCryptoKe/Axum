# Axum Arcade

[🌐 Live Demo](https://axumarcade.wuaze.com/public/) 

Axum Arcade is a **web-based platform for hosting, sharing, and playing indie games**. It provides a complete ecosystem for developers to upload their creations and for players to discover new games, leave reviews, and interact with the community.

---

## Features

- **User Authentication**: Secure user registration and login system.
- **Game Upload and Management**: Developers can upload, edit, and manage their games.
- **Game Discovery**: Players can browse, search, and filter games.
- **Game Pages**: Each game has a dedicated page with details, screenshots, and download links.
- **Reviews and Ratings**: Users can rate games and write reviews to share their feedback.
- **Admin Panel**: A dashboard for administrators to manage users, games, and reviews.
- **AI Chat Support**: An integrated AI assistant, **Axum**, to help users navigate the site.

---

## Tech Stack

- **Backend**: PHP  
- **Frontend**: HTML, CSS, JavaScript (vanilla, no framework)  
- **Database**: MySQL  
- **AI**: Google Gemini API  

---

## Project Structure

/
├── app/
│ ├── config/
│ │ ├── db.php
│ │ └── chat_handler.php
│ ├── controllers/
│ │ ├── AdminController.php
│ │ ├── CategoryController.php
│ │ ├── GameController.php
│ │ ├── SearchController.php
│ │ └── UserController.php
│ ├── helpers/
│ │ └── auth.php
│ └── models/
│ ├── BaseModel.php
│ ├── Category.php
│ ├── Game.php
│ ├── GameCategory.php
│ ├── ModerationAction.php
│ ├── Purchase.php
│ ├── Review.php
│ └── User.php
├── public/
│ ├── .htaccess
│ ├── index.php
│ ├── api/
│ │ └── chat_handler.php
│ ├── assets/
│ │ ├── css/
│ │ ├── img/
│ │ └── js/
│ └── uploads/
│ ├── avatars/
│ ├── covers/
│ └── games/
└── views/
├── admin/
├── game/
├── layout/
├── library/
├── others/
└── user/
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

## License

*(Optional: add your license information here if applicable.)*

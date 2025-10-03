/project-root
│
├── /public              # Publicly accessible stuff (root for Apache/Nginx)
│   ├── index.php        # Entry point (front controller)
│   ├── login.php        # Login form (calls controller)
│   ├── signup.php       # Signup form
│   ├── logout.php
│   ├── game.php         # Game detail page (or modal trigger)
│   ├── profile.php      # User profile page
│   ├── library.php      # User’s games
│   ├── admin.php        # Admin panel entry
│   ├── uploads/         # Uploaded game files/screenshots (with .htaccess!)
│   └── assets/
│       ├── css/         # Stylesheets (add later)
│       ├── js/          # Scripts (add later)
│       ├── img/         # Logos, icons, default avatars
│       └── fonts/
│
├── /app                 # Core PHP application code
│   ├── /config/
│   │   ├── db.php       # Database connection
│   │   └── mail.php     # Mail/OTP config
│   │
│   ├── /controllers/    # Business logic (handle requests)
│   │   ├── UserController.php
│   │   ├── GameController.php
│   │   ├── ReviewController.php
│   │   └── AdminController.php
│   │
│   ├── /models/         # Database models (CRUD)
│   │   ├── User.php
│   │   ├── Game.php
│   │   ├── Review.php
│   │   └── Transaction.php
│   │
│   └── /helpers/        # Utilities shared across app
│       ├── auth.php     # Session management
│       ├── otp.php      # OTP/email handling
│       ├── file.php     # Upload & file validation
│       └── utils.php    # Misc (sanitize, redirect, etc.)
│
├── /views               # HTML templates
│   ├── layout/          # Shared UI
│   │   ├── header.php
│   │   ├── footer.php
│   │   └── navbar.php
│   │
│   ├── user/            # Pages for users
│   │   ├── signup.php
│   │   ├── login.php
│   │   └── profile.php
│   │
│   ├── game/            # Pages for games
│   │   ├── upload.php
│   │   ├── list.php     # Homepage / explore
│   │   └── detail.php
│   │
│   └── admin/           # Admin-only pages
│       ├── dashboard.php
│       └── users.php
│
├── /storage             # Non-public files
│   ├── logs/            # Error logs, app logs
│   ├── cache/           # Sessions, cached queries
│   └── backups/         # DB backups if you want
│
├── .env                 # Environment variables (DB creds, API keys)
├── composer.json        # If you use composer (mailer, dotenv, etc.)
└── README.md            # Project overview

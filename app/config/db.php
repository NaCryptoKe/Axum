<?php
// Manages the database connection using a singleton pattern.
class Database
{
    private static ?Database $instance = null;
    private PDO $connection;

    private string $host = "localhost";
    private string $dbName = "axumarcade";
    private string $user = "root";
    private string $pass = "";
    private string $charset = "utf8mb4";

    private function __construct()
    {
        $dsn = "mysql:host={$this->host};dbname={$this->dbName};charset={$this->charset}";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $this->connection = new PDO($dsn, $this->user, $this->pass, $options);
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection(): PDO
    {
        return $this->connection;
    }
}

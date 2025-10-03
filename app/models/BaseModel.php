<?php
// app/models/BaseModel.php
require_once __DIR__ . "/../config/db.php";

abstract class BaseModel
{
    protected PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }
}


<?php
class Database {
    // Database credentials
    private $host = "localhost";
    private $db_name = "checklist_manager";
    private $username = "checklist_user";
    private $password = "Track2025!#Secure@Pwd"; // Using stronger password that meets policy requirements
    public $conn;

    // Get database connection
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
            return null;
        }
    }
    
    // Check if a table exists
    public function tableExists($tableName) {
        try {
            $result = $this->conn->query("SHOW TABLES LIKE '{$tableName}'");
            return $result->rowCount() > 0;
        } catch(PDOException $exception) {
            echo "Error checking table: " . $exception->getMessage();
            return false;
        }
    }
}
?>

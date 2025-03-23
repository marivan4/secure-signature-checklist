
<?php
class Database {
    // Credenciais do banco de dados
    private $host = "localhost";
    private $db_name = "checklist_manager";
    private $username = "checklist_user";
    private $password = "sua_senha_segura";
    public $conn;

    // Conectar ao banco de dados
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Erro de conexão: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>


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
    
    // Criar tabela de veículos se não existir
    public function createVehiclesTableIfNotExists() {
        $query = "CREATE TABLE IF NOT EXISTS veiculos (
            chassis VARCHAR(17) PRIMARY KEY,
            linha VARCHAR(50),
            modelo VARCHAR(50),
            data_fabricacao DATE,
            ultima_inspecao DATETIME,
            cliente_id INT,
            FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
        )";
        
        try {
            $this->conn->exec($query);
            return true;
        } catch(PDOException $exception) {
            echo "Erro ao criar tabela: " . $exception->getMessage();
            return false;
        }
    }
}
?>

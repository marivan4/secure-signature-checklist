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
            return $this->conn;
        } catch(PDOException $exception) {
            echo "Erro de conexão: " . $exception->getMessage();
            return null;
        }
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
    
    // Função para verificar se uma tabela existe
    public function tableExists($tableName) {
        try {
            $result = $this->conn->query("SHOW TABLES LIKE '{$tableName}'");
            return $result->rowCount() > 0;
        } catch(PDOException $exception) {
            echo "Erro ao verificar tabela: " . $exception->getMessage();
            return false;
        }
    }
    
    // Função para verificar e criar tabela de faturas se não existir
    public function createInvoicesTableIfNotExists() {
        $query = "CREATE TABLE IF NOT EXISTS invoices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            checklistId INT,
            invoiceNumber VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            status ENUM('pending', 'paid', 'cancelled') NOT NULL DEFAULT 'pending',
            dueDate DATE NOT NULL,
            paidDate DATE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            email VARCHAR(100),
            phone VARCHAR(20),
            asaasId VARCHAR(100),
            billingType ENUM('BOLETO', 'PIX', 'CREDIT_CARD') DEFAULT 'BOLETO',
            blocked TINYINT(1) DEFAULT 0
        )";
        
        try {
            $this->conn->exec($query);
            return true;
        } catch(PDOException $exception) {
            echo "Erro ao criar tabela de faturas: " . $exception->getMessage();
            return false;
        }
    }
    
    // Função para atualizar estrutura da tabela se necessário
    public function updateInvoicesTableStructure() {
        try {
            // Verifica se a coluna billingType já existe
            $result = $this->conn->query("SHOW COLUMNS FROM invoices LIKE 'billingType'");
            if ($result->rowCount() == 0) {
                // Adiciona a coluna billingType se não existir
                $this->conn->exec("ALTER TABLE invoices ADD COLUMN billingType ENUM('BOLETO', 'PIX', 'CREDIT_CARD') DEFAULT 'BOLETO' AFTER asaasId");
                echo "Coluna billingType adicionada com sucesso.\n";
            }
            
            // Verifica se a coluna blocked já existe
            $result = $this->conn->query("SHOW COLUMNS FROM invoices LIKE 'blocked'");
            if ($result->rowCount() == 0) {
                // Adiciona a coluna blocked se não existir
                $this->conn->exec("ALTER TABLE invoices ADD COLUMN blocked TINYINT(1) DEFAULT 0 AFTER billingType");
                echo "Coluna blocked adicionada com sucesso.\n";
            }
            
            return true;
        } catch(PDOException $exception) {
            echo "Erro ao atualizar estrutura da tabela: " . $exception->getMessage();
            return false;
        }
    }
    
    // Função para verificar e criar tabela de revendas se não existir
    public function createResellersTableIfNotExists() {
        $query = "CREATE TABLE IF NOT EXISTS revendas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            logo VARCHAR(255),
            address VARCHAR(255),
            city VARCHAR(255),
            state VARCHAR(2),
            zip_code VARCHAR(10),
            email VARCHAR(255),
            phone VARCHAR(20),
            contact_name VARCHAR(255),
            contact_phone VARCHAR(20),
            description TEXT,
            status ENUM('active', 'pending', 'inactive') NOT NULL DEFAULT 'pending',
            clients_count INT DEFAULT 0,
            monthly_revenue DECIMAL(10,2) DEFAULT 0,
            since DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by INT NOT NULL,
            asaas_configured BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES usuarios(id),
            FOREIGN KEY (created_by) REFERENCES usuarios(id)
        )";
        
        try {
            $this->conn->exec($query);
            return true;
        } catch(PDOException $exception) {
            echo "Erro ao criar tabela de revendas: " . $exception->getMessage();
            return false;
        }
    }
    
    // Função para verificar e criar tabela de clientes de revendas se não existir
    public function createResellerClientsTableIfNotExists() {
        $query = "CREATE TABLE IF NOT EXISTS reseller_clients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            reseller_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            cpf_cnpj VARCHAR(20) NOT NULL,
            address VARCHAR(255),
            city VARCHAR(255),
            state VARCHAR(2),
            zip_code VARCHAR(10),
            status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (reseller_id) REFERENCES revendas(id)
        )";
        
        try {
            $this->conn->exec($query);
            return true;
        } catch(PDOException $exception) {
            echo "Erro ao criar tabela de clientes de revendas: " . $exception->getMessage();
            return false;
        }
    }
}
?>

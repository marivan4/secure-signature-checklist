
<?php
// Database setup script for Track'n'Me system
header('Content-Type: text/html; charset=UTF-8');

// Configuration variables
$db_host = 'localhost';
$db_name = 'checklist_manager';
$db_user = 'checklist_user';
$db_pass = 'secure_password_123'; // You should change this in production

// Connect to MySQL without selecting a database
$conn = new mysqli($db_host, 'root', ''); // Using root to create database and user

// Check connection
if ($conn->connect_error) {
    die('Conexão falhou: ' . $conn->connect_error);
}

echo "<h1>Track'n'Me - Configuração do Banco de Dados</h1>";
echo "<div style='font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;'>";

// Create database if not exists
$sql = "CREATE DATABASE IF NOT EXISTS $db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if ($conn->query($sql) === TRUE) {
    echo "<p>✅ Banco de dados '$db_name' criado com sucesso.</p>";
} else {
    echo "<p>❌ Erro ao criar banco de dados: " . $conn->error . "</p>";
}

// Create user if not exists and grant privileges
$sql = "SELECT user FROM mysql.user WHERE user = '$db_user'";
$result = $conn->query($sql);

if ($result->num_rows == 0) {
    // User doesn't exist, create it
    $sql = "CREATE USER '$db_user'@'localhost' IDENTIFIED BY '$db_pass'";
    if ($conn->query($sql) === TRUE) {
        echo "<p>✅ Usuário '$db_user' criado com sucesso.</p>";
    } else {
        echo "<p>❌ Erro ao criar usuário: " . $conn->error . "</p>";
    }
}

// Grant privileges to the user
$sql = "GRANT ALL PRIVILEGES ON $db_name.* TO '$db_user'@'localhost'";
if ($conn->query($sql) === TRUE) {
    echo "<p>✅ Privilégios concedidos ao usuário '$db_user'.</p>";
    $conn->query("FLUSH PRIVILEGES");
} else {
    echo "<p>❌ Erro ao conceder privilégios: " . $conn->error . "</p>";
}

// Connect to the newly created database
$conn->select_db($db_name);

// Check if tables exist
$sql = "SHOW TABLES";
$result = $conn->query($sql);
$tableCount = $result->num_rows;

if ($tableCount > 0) {
    echo "<p>✅ O banco de dados já contém $tableCount tabelas.</p>";
} else {
    echo "<p>ℹ️ O banco de dados está vazio. Criando tabelas...</p>";
    
    // Sample table creation - Replace with your actual schema
    $sql = "
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(200),
        email VARCHAR(200),
        role ENUM('admin', 'manager', 'client', 'reseller', 'end_client') NOT NULL DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    
    CREATE TABLE clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        company_name VARCHAR(200),
        contact_name VARCHAR(200),
        phone VARCHAR(20),
        email VARCHAR(200),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    
    CREATE TABLE trackers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT,
        serial_number VARCHAR(100) NOT NULL,
        model VARCHAR(100),
        status ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
        installation_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    
    CREATE TABLE invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT,
        amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'paid', 'overdue', 'canceled') NOT NULL DEFAULT 'pending',
        due_date DATE NOT NULL,
        payment_date DATE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    
    // Execute multi-query SQL
    if ($conn->multi_query($sql)) {
        do {
            // Store result set
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->more_results() && $conn->next_result());
        
        echo "<p>✅ Tabelas criadas com sucesso.</p>";
    } else {
        echo "<p>❌ Erro ao criar tabelas: " . $conn->error . "</p>";
    }
    
    // Wait a moment before checking tables
    sleep(1);
    
    // Reconnect to avoid issues after multiple queries
    $conn->close();
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    
    // Insert sample users
    $sql = "SELECT * FROM users WHERE username = 'admin'";
    $result = $conn->query($sql);
    
    if ($result->num_rows == 0) {
        // Hash passwords
        $admin_pass = password_hash('admin', PASSWORD_DEFAULT);
        $manager_pass = password_hash('manager', PASSWORD_DEFAULT);
        $client_pass = password_hash('client', PASSWORD_DEFAULT);
        $reseller_pass = password_hash('reseller', PASSWORD_DEFAULT);
        $end_client_pass = password_hash('endclient', PASSWORD_DEFAULT);
        
        // Insert users
        $sql = "
        INSERT INTO users (username, password, name, email, role) VALUES 
        ('admin', '$admin_pass', 'Administrador', 'admin@tracknme.com', 'admin'),
        ('manager', '$manager_pass', 'Gerente', 'manager@tracknme.com', 'manager'),
        ('client', '$client_pass', 'Cliente Demo', 'client@example.com', 'client'),
        ('reseller', '$reseller_pass', 'Revenda Demo', 'reseller@example.com', 'reseller'),
        ('endclient', '$end_client_pass', 'Cliente Final Demo', 'endclient@example.com', 'end_client');
        ";
        
        if ($conn->query($sql) === TRUE) {
            echo "<p>✅ Usuários de teste criados com sucesso.</p>";
        } else {
            echo "<p>❌ Erro ao criar usuários: " . $conn->error . "</p>";
        }
    } else {
        echo "<p>ℹ️ Usuários já existem no banco de dados.</p>";
    }
}

// Create necessary directories for the API
$apiDir = __DIR__ . '/api';
if (!is_dir($apiDir)) {
    if (mkdir($apiDir, 0755, true)) {
        echo "<p>✅ Diretório API criado com sucesso.</p>";
    } else {
        echo "<p>❌ Erro ao criar diretório API.</p>";
    }
}

$configDir = $apiDir . '/config';
if (!is_dir($configDir)) {
    if (mkdir($configDir, 0755, true)) {
        echo "<p>✅ Diretório de configuração da API criado com sucesso.</p>";
    } else {
        echo "<p>❌ Erro ao criar diretório de configuração da API.</p>";
    }
}

// Create uploads directory
$uploadsDir = __DIR__ . '/uploads';
if (!is_dir($uploadsDir)) {
    if (mkdir($uploadsDir, 0755, true)) {
        echo "<p>✅ Diretório de uploads criado com sucesso.</p>";
    } else {
        echo "<p>❌ Erro ao criar diretório de uploads.</p>";
    }
}

// Create database configuration file
$dbConfigFile = $configDir . '/database.php';
$dbConfigContent = "<?php
// Database Configuration
return [
    'host' => '$db_host',
    'database' => '$db_name',
    'username' => '$db_user',
    'password' => '$db_pass',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci'
];
";

if (file_put_contents($dbConfigFile, $dbConfigContent)) {
    echo "<p>✅ Arquivo de configuração do banco de dados criado com sucesso.</p>";
} else {
    echo "<p>❌ Erro ao criar arquivo de configuração do banco de dados.</p>";
}

// Close database connection
$conn->close();

echo "<p>🎉 Configuração concluída! Agora você pode <a href='/system-check.php'>Verificar o sistema</a> ou <a href='/'>Ir para o aplicativo</a>.</p>";

echo "<div class='warning' style='border: 1px solid #e74c3c; background: #fadbd8; padding: 10px; margin-top: 20px;'>";
echo "<strong>IMPORTANTE:</strong> Por motivos de segurança, remova este script após a configuração inicial.";
echo "</div>";

echo "</div>";
?>

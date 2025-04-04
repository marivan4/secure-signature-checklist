<?php
// Configuração de conexão com o banco de dados
$host = "localhost";
$username = "checklist_user";
$password = "sua_senha_segura";
$dbname = "checklist_manager";

// Cria conexão
$conn = new mysqli($host, $username, $password, $dbname);

// Verifica conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->error);
}

echo "<h1>Configurando banco de dados para o Sistema de Rastreamento Veicular</h1>";

// Cria tabela de usuários se não existir
$sql_users = "CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    role ENUM('admin', 'manager', 'client', 'reseller', 'end_client') NOT NULL DEFAULT 'client',
    parent_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES usuarios(id) ON DELETE SET NULL
)";

if ($conn->query($sql_users) === TRUE) {
    echo "<p>Tabela 'usuarios' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'usuarios': " . $conn->error . "</p>";
}

// Cria tabela de checklists se não existir
$sql_checklists = "CREATE TABLE IF NOT EXISTS checklists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reseller_id INT NULL,
    cpf_cnpj VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    address_number VARCHAR(50),
    neighborhood VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    vehicle_model VARCHAR(255),
    license_plate VARCHAR(20),
    tracker_model VARCHAR(100),
    tracker_imei VARCHAR(50),
    registration_date DATE,
    installation_location VARCHAR(255),
    status ENUM('pending', 'signed', 'completed') NOT NULL DEFAULT 'pending',
    ip_address VARCHAR(45),
    signature_data TEXT,
    signed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id),
    FOREIGN KEY (reseller_id) REFERENCES usuarios(id)
)";

if ($conn->query($sql_checklists) === TRUE) {
    echo "<p>Tabela 'checklists' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'checklists': " . $conn->error . "</p>";
}

// Cria tabela de veículos se não existir
$sql_vehicles = "CREATE TABLE IF NOT EXISTS veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chassis VARCHAR(17),
    linha VARCHAR(50),
    modelo VARCHAR(50),
    data_fabricacao DATE,
    ultima_inspecao DATETIME,
    cliente_id INT,
    reseller_id INT NULL,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (reseller_id) REFERENCES usuarios(id)
)";

if ($conn->query($sql_vehicles) === TRUE) {
    echo "<p>Tabela 'veiculos' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'veiculos': " . $conn->error . "</p>";
}

// Cria tabela de faturas se não existir
$sql_invoices = "CREATE TABLE IF NOT EXISTS faturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reseller_id INT NULL,
    checklist_id INT,
    invoice_number VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'cancelled') NOT NULL DEFAULT 'pending',
    due_date DATE NOT NULL,
    paid_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id),
    FOREIGN KEY (reseller_id) REFERENCES usuarios(id),
    FOREIGN KEY (checklist_id) REFERENCES checklists(id) ON DELETE SET NULL
)";

if ($conn->query($sql_invoices) === TRUE) {
    echo "<p>Tabela 'faturas' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'faturas': " . $conn->error . "</p>";
}

// Cria tabela de configurações do WhatsApp se não existir
$sql_whatsapp_config = "CREATE TABLE IF NOT EXISTS whatsapp_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    instance VARCHAR(100) NOT NULL DEFAULT 'default',
    base_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
)";

if ($conn->query($sql_whatsapp_config) === TRUE) {
    echo "<p>Tabela 'whatsapp_config' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'whatsapp_config': " . $conn->error . "</p>";
}

// Cria tabela de configurações do Asaas se não existir
$sql_asaas_config = "CREATE TABLE IF NOT EXISTS asaas_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    sandbox BOOLEAN NOT NULL DEFAULT 1,
    user_role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
)";

if ($conn->query($sql_asaas_config) === TRUE) {
    echo "<p>Tabela 'asaas_config' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'asaas_config': " . $conn->error . "</p>";
}

// Cria tabela de configurações do sistema se não existir
$sql_system_config = "CREATE TABLE IF NOT EXISTS system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql_system_config) === TRUE) {
    echo "<p>Tabela 'system_config' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'system_config': " . $conn->error . "</p>";
}

// Cria tabela de revendas se não existir
$sql_resellers = "CREATE TABLE IF NOT EXISTS revendas (
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

if ($conn->query($sql_resellers) === TRUE) {
    echo "<p>Tabela 'revendas' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'revendas': " . $conn->error . "</p>";
}

// Cria tabela de clientes de revendas se não existir
$sql_reseller_clients = "CREATE TABLE IF NOT EXISTS reseller_clients (
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

if ($conn->query($sql_reseller_clients) === TRUE) {
    echo "<p>Tabela 'reseller_clients' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'reseller_clients': " . $conn->error . "</p>";
}

// Adiciona chave global da API WhatsApp nas configurações do sistema
$check_api_key = "SELECT * FROM system_config WHERE config_key = 'whatsapp_global_api_key'";
$result = $conn->query($check_api_key);

if ($result->num_rows == 0) {
    $insert_api_key = "INSERT INTO system_config (config_key, config_value, description) 
                      VALUES ('whatsapp_global_api_key', 'd9919cda7e370839d33b8946584dac93', 'Chave global da API do WhatsApp')";
    
    if ($conn->query($insert_api_key) === TRUE) {
        echo "<p>Chave global da API do WhatsApp adicionada às configurações.</p>";
    } else {
        echo "<p>Erro ao adicionar chave global da API: " . $conn->error . "</p>";
    }
} else {
    echo "<p>Chave global da API do WhatsApp já existe nas configurações.</p>";
}

// Adiciona usuário admin padrão se não existir
$check_admin = "SELECT * FROM usuarios WHERE username = 'admin'";
$result = $conn->query($check_admin);

if ($result->num_rows == 0) {
    // Senha padrão 'admin' com hash
    $hashed_password = password_hash('admin', PASSWORD_DEFAULT);
    
    $insert_admin = "INSERT INTO usuarios (username, password, role) 
                   VALUES ('admin', '$hashed_password', 'admin')";
    
    if ($conn->query($insert_admin) === TRUE) {
        echo "<p>Usuário admin padrão criado com senha 'admin'.</p>";
    } else {
        echo "<p>Erro ao criar usuário admin: " . $conn->error . "</p>";
    }
} else {
    echo "<p>Usuário admin já existe.</p>";
}

// Adiciona usuário cliente de teste se não existir
$check_client = "SELECT * FROM usuarios WHERE username = 'client'";
$result = $conn->query($check_client);

if ($result->num_rows == 0) {
    // Senha padrão 'client' com hash
    $hashed_password = password_hash('client', PASSWORD_DEFAULT);
    
    $insert_client = "INSERT INTO usuarios (username, password, role) 
                    VALUES ('client', '$hashed_password', 'client')";
    
    if ($conn->query($insert_client) === TRUE) {
        echo "<p>Usuário cliente padrão criado com senha 'client'.</p>";
    } else {
        echo "<p>Erro ao criar usuário cliente: " . $conn->error . "</p>";
    }
} else {
    echo "<p>Usuário cliente já existe.</p>";
}

// Adiciona usuário gerente de teste se não existir
$check_manager = "SELECT * FROM usuarios WHERE username = 'manager'";
$result = $conn->query($check_manager);

if ($result->num_rows == 0) {
    // Senha padrão 'manager' com hash
    $hashed_password = password_hash('manager', PASSWORD_DEFAULT);
    
    $insert_manager = "INSERT INTO usuarios (username, password, role) 
                     VALUES ('manager', '$hashed_password', 'manager')";
    
    if ($conn->query($insert_manager) === TRUE) {
        echo "<p>Usuário gerente padrão criado com senha 'manager'.</p>";
    } else {
        echo "<p>Erro ao criar usuário gerente: " . $conn->error . "</p>";
    }
} else {
    echo "<p>Usuário gerente já existe.</p>";
}

// Adiciona usuário revenda de teste se não existir
$check_reseller = "SELECT * FROM usuarios WHERE username = 'reseller'";
$result = $conn->query($check_reseller);

if ($result->num_rows == 0) {
    // Senha padrão 'reseller' com hash
    $hashed_password = password_hash('reseller', PASSWORD_DEFAULT);
    
    $insert_reseller = "INSERT INTO usuarios (username, password, role) 
                     VALUES ('reseller', '$hashed_password', 'reseller')";
    
    if ($conn->query($insert_reseller) === TRUE) {
        echo "<p>Usuário revenda padrão criado com senha 'reseller'.</p>";
    } else {
        echo "<p>Erro ao criar usuário revenda: " . $conn->error . "</p>";
    }
} else {
    echo "<p>Usuário revenda já existe.</p>";
}

// Adiciona usuário cliente final de teste se não existir
$check_end_client = "SELECT * FROM usuarios WHERE username = 'endclient'";
$result = $conn->query($check_end_client);

if ($result->num_rows == 0) {
    // Senha padrão 'endclient' com hash
    $hashed_password = password_hash('endclient', PASSWORD_DEFAULT);
    
    $insert_end_client = "INSERT INTO usuarios (username, password, role) 
                    VALUES ('endclient', '$hashed_password', 'end_client')";
    
    if ($conn->query($insert_end_client) === TRUE) {
        echo "<p>Usuário cliente final padrão criado com senha 'endclient'.</p>";
    } else {
        echo "<p>Erro ao criar usuário cliente final: " . $conn->error . "</p>";
    }
} else {
    echo "<p>Usuário cliente final já existe.</p>";
}

echo "<h2>Configuração do banco de dados concluída!</h2>";
echo "<p>O banco de dados foi configurado com sucesso para o Sistema de Rastreamento Veicular.</p>";
echo "<p><a href='/'>Voltar para a página inicial</a></p>";

$conn->close();
?>

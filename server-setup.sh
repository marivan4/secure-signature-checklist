
#!/bin/bash

# Script de configuração do servidor para Track'n'Me
echo "Iniciando configuração do servidor para Track'n'Me"
echo "=================================================="

# Atualizar o sistema
echo "Atualizando o sistema..."
sudo apt update
sudo apt upgrade -y

# Instalar pacotes necessários
echo "Instalando Apache, MySQL, PHP e extensões..."
sudo apt install -y apache2 mysql-server php php-cli php-fpm php-json php-common php-mysql php-zip php-gd php-mbstring php-curl php-xml php-pear php-bcmath unzip git

# Configurar Apache
echo "Configurando Apache..."
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl

# Criar diretório para o sistema
echo "Criando diretório para o sistema..."
sudo mkdir -p /var/www/html/sistema

# Configurar VirtualHost
echo "Configurando VirtualHost..."
cat > /tmp/narrota.conf << 'EOL'
<VirtualHost *:80>
    ServerName app8.narrota.com.br
    ServerAdmin webmaster@narrota.com.br
    DocumentRoot /var/www/html/sistema

    <Directory /var/www/html/sistema>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/narrota-error.log
    CustomLog ${APACHE_LOG_DIR}/narrota-access.log combined

    # Redirect to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName app8.narrota.com.br
    ServerAdmin webmaster@narrota.com.br
    DocumentRoot /var/www/html/sistema

    <Directory /var/www/html/sistema>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/narrota-ssl-error.log
    CustomLog ${APACHE_LOG_DIR}/narrota-ssl-access.log combined

    # SSL Configuration (a ser configurado com certbot)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/app8.narrota.com.br/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/app8.narrota.com.br/privkey.pem
</VirtualHost>
EOL

sudo mv /tmp/narrota.conf /etc/apache2/sites-available/narrota.conf
sudo a2ensite narrota.conf

# Instalar e configurar Certbot para SSL
echo "Instalando Certbot para SSL..."
sudo apt install -y certbot python3-certbot-apache
echo "IMPORTANTE: Execute manualmente o comando abaixo para obter certificado SSL:"
echo "sudo certbot --apache -d app8.narrota.com.br"

# Configurar MySQL
echo "Configurando MySQL..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS checklist_manager;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'checklist_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';"
sudo mysql -e "GRANT ALL PRIVILEGES ON checklist_manager.* TO 'checklist_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Criar script de implantação do banco de dados
echo "Criando script de implantação do banco de dados..."
cat > /var/www/html/sistema/db_setup.php << 'EOL'
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
    die("Falha na conexão: " . $conn->connect_error);
}

echo "<h1>Configurando banco de dados para o Sistema Track'n'Me</h1>";

// Cria tabela de usuários
$sql_users = "CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'client') NOT NULL DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql_users) === TRUE) {
    echo "<p>Tabela 'usuarios' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'usuarios': " . $conn->error . "</p>";
}

// Cria tabela de checklists
$sql_checklists = "CREATE TABLE IF NOT EXISTS checklists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
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
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
)";

if ($conn->query($sql_checklists) === TRUE) {
    echo "<p>Tabela 'checklists' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'checklists': " . $conn->error . "</p>";
}

// Cria tabela de veículos
$sql_vehicles = "CREATE TABLE IF NOT EXISTS veiculos (
    chassis VARCHAR(17) PRIMARY KEY,
    linha VARCHAR(50),
    modelo VARCHAR(50),
    data_fabricacao DATE,
    ultima_inspecao DATETIME,
    cliente_id INT,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
)";

if ($conn->query($sql_vehicles) === TRUE) {
    echo "<p>Tabela 'veiculos' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'veiculos': " . $conn->error . "</p>";
}

// Cria tabela de faturas
$sql_invoices = "CREATE TABLE IF NOT EXISTS invoices (
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

if ($conn->query($sql_invoices) === TRUE) {
    echo "<p>Tabela 'invoices' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'invoices': " . $conn->error . "</p>";
}

// Cria tabela para configurações do WhatsApp
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

// Cria tabela para configurações do sistema
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

// Cria tabela para cartões SIM
$sql_sim_cards = "CREATE TABLE IF NOT EXISTS sim_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    iccid VARCHAR(50) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    operator VARCHAR(50) NOT NULL,
    plan VARCHAR(100),
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'inactive',
    activation_date DATE,
    expiration_date DATE,
    client_id INT,
    tracker_id INT,
    monthly_fee DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql_sim_cards) === TRUE) {
    echo "<p>Tabela 'sim_cards' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'sim_cards': " . $conn->error . "</p>";
}

// Cria tabela para operadoras de SIM
$sql_operators = "CREATE TABLE IF NOT EXISTS operators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    api_key VARCHAR(255),
    api_url VARCHAR(255),
    contact_name VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    notes TEXT,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql_operators) === TRUE) {
    echo "<p>Tabela 'operators' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'operators': " . $conn->error . "</p>";
}

// Cria tabela para agendamentos
$sql_scheduling = "CREATE TABLE IF NOT EXISTS scheduling (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    appointment_date DATETIME NOT NULL,
    vehicle_info TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    technician_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql_scheduling) === TRUE) {
    echo "<p>Tabela 'scheduling' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'scheduling': " . $conn->error . "</p>";
}

// Cria tabela para configurações de agendamento
$sql_scheduling_config = "CREATE TABLE IF NOT EXISTS scheduling_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_type VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    available_days VARCHAR(20) DEFAULT '1,2,3,4,5', /* dias da semana disponíveis */
    start_time TIME DEFAULT '09:00:00',
    end_time TIME DEFAULT '18:00:00',
    max_daily_appointments INT DEFAULT 10,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql_scheduling_config) === TRUE) {
    echo "<p>Tabela 'scheduling_config' criada ou já existente.</p>";
} else {
    echo "<p>Erro ao criar tabela 'scheduling_config': " . $conn->error . "</p>";
}

// Adiciona usuário admin padrão
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

// Adiciona dados iniciais às operadoras
$operators = [
    ['name' => 'Vivo', 'api_url' => 'https://api.vivo.com.br', 'active' => 1],
    ['name' => 'Claro', 'api_url' => 'https://api.claro.com.br', 'active' => 1],
    ['name' => 'TIM', 'api_url' => 'https://api.tim.com.br', 'active' => 1],
    ['name' => 'Oi', 'api_url' => 'https://api.oi.com.br', 'active' => 1],
    ['name' => 'Linkfields', 'api_url' => 'https://api.linkfields.com', 'active' => 1],
    ['name' => 'Arqia', 'api_url' => 'https://api.arqia.com.br', 'active' => 1],
    ['name' => 'Transmeet', 'api_url' => 'https://api.transmeet.com', 'active' => 1],
    ['name' => 'Hinova', 'api_url' => 'https://api.hinova.com.br', 'active' => 1]
];

foreach ($operators as $operator) {
    $check_operator = "SELECT * FROM operators WHERE name = '{$operator['name']}'";
    $result = $conn->query($check_operator);
    
    if ($result->num_rows == 0) {
        $insert_operator = "INSERT INTO operators (name, api_url, active) 
                         VALUES ('{$operator['name']}', '{$operator['api_url']}', {$operator['active']})";
        
        if ($conn->query($insert_operator) === TRUE) {
            echo "<p>Operadora {$operator['name']} adicionada.</p>";
        } else {
            echo "<p>Erro ao adicionar operadora {$operator['name']}: " . $conn->error . "</p>";
        }
    } else {
        echo "<p>Operadora {$operator['name']} já existe.</p>";
    }
}

echo "<h2>Configuração do banco de dados concluída!</h2>";
echo "<p>O banco de dados foi configurado com sucesso para o Sistema Track'n'Me.</p>";
echo "<p><a href='/'>Voltar para a página inicial</a></p>";

$conn->close();
?>
EOL

# Criar documentação de instalação
echo "Criando documentação de instalação..."
cat > /var/www/html/sistema/INSTALL.md << 'EOL'
# Documentação de Instalação - Sistema Track'n'Me

## Requisitos do Sistema
- Ubuntu Server 22.04 LTS
- Apache 2.4+
- PHP 8.0+
- MySQL 8.0+

## Instalação Passo a Passo

### 1. Preparação do Servidor

Execute o script `server-setup.sh` para configurar automaticamente o servidor:

```bash
sudo chmod +x server-setup.sh
sudo ./server-setup.sh
```

### 2. Configuração do Certificado SSL

Execute o comando para obter um certificado SSL gratuito via Let's Encrypt:

```bash
sudo certbot --apache -d app8.narrota.com.br
```

Siga as instruções na tela para completar a configuração.

### 3. Implantação do Frontend

Clone o repositório do frontend React e construa a aplicação:

```bash
cd /tmp
git clone [URL_DO_REPOSITORIO] tracknme
cd tracknme
npm install
npm run build
sudo cp -r build/* /var/www/html/sistema/
```

### 4. Configuração do Banco de Dados

Acesse a URL abaixo para configurar o banco de dados:

```
https://app8.narrota.com.br/db_setup.php
```

Após a configuração, remova o arquivo de configuração por segurança:

```bash
sudo rm /var/www/html/sistema/db_setup.php
```

### 5. Configurações de Segurança

1. Ajuste as permissões dos arquivos:

```bash
sudo find /var/www/html/sistema -type f -exec chmod 644 {} \;
sudo find /var/www/html/sistema -type d -exec chmod 755 {} \;
sudo chown -R www-data:www-data /var/www/html/sistema
```

2. Configure o arquivo .htaccess:

```bash
sudo cp /var/www/html/sistema/.htaccess.example /var/www/html/sistema/.htaccess
```

### 6. Verificação da Instalação

Acesse a aplicação através do navegador:

```
https://app8.narrota.com.br
```

Use as credenciais padrão para fazer login:
- Usuário: admin
- Senha: admin

**IMPORTANTE**: Altere a senha do administrador imediatamente após o primeiro login.

## Manutenção

### Backups

Configure backups diários do banco de dados:

```bash
sudo nano /etc/cron.daily/backup-tracknme-db
```

Adicione o seguinte conteúdo:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d")
BACKUP_DIR="/var/backups/tracknme"
mkdir -p $BACKUP_DIR
mysqldump -u checklist_user -p'sua_senha_segura' checklist_manager > $BACKUP_DIR/db_backup_$TIMESTAMP.sql
```

Torne o script executável:

```bash
sudo chmod +x /etc/cron.daily/backup-tracknme-db
```

### Atualizações

Para atualizar o sistema:

1. Faça backup do banco de dados
2. Coloque o site em modo de manutenção
3. Atualize os arquivos
4. Execute quaisquer migrações necessárias
5. Remova o modo de manutenção

## Resolução de Problemas

Verifique os logs do Apache:

```bash
sudo tail -f /var/log/apache2/narrota-error.log
```

Verifique os logs do PHP:

```bash
sudo tail -f /var/log/php/error.log
```

## Suporte

Para obter suporte, entre em contato através do email: suporte@narrota.com.br
EOL

# Criar arquivo .htaccess
echo "Criando arquivo .htaccess..."
cat > /var/www/html/sistema/.htaccess << 'EOL'
# Enable rewrite engine
RewriteEngine On

# If the request is for an actual file or directory, serve it directly
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# If the request is for a PHP file, serve it directly
RewriteCond %{REQUEST_URI} \.php$
RewriteRule ^ - [L]

# Allow direct access to the API directory
RewriteRule ^api/ - [L]

# Otherwise, redirect all requests to index.html
RewriteRule ^ index.html [L]

# Set security headers
<IfModule mod_headers.c>
    # Prevent clickjacking
    Header set X-Frame-Options "SAMEORIGIN"
    # Enable XSS protection
    Header set X-XSS-Protection "1; mode=block"
    # Prevent MIME type sniffing
    Header set X-Content-Type-Options "nosniff"
    # Ensure UTF-8 encoding for all text content
    Header set Content-Type "text/html; charset=UTF-8"
</IfModule>

# Enable CORS for API
<IfModule mod_headers.c>
    <FilesMatch "\.(php)$">
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
        Header set Access-Control-Allow-Headers "Content-Type, Authorization"
    </FilesMatch>
</IfModule>

# PHP settings (if needed)
<IfModule mod_php8.c>
    php_flag display_errors Off
    php_value max_execution_time 300
    php_value upload_max_filesize 10M
    php_value post_max_size 20M
    php_value memory_limit 256M
    # Garantir que PHP use UTF-8
    php_value default_charset "UTF-8"
</IfModule>

# Disable directory listing
Options -Indexes

# Prevent access to sensitive files
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>
EOL

# Criar arquivo para verificação do sistema
echo "Criando arquivo de verificação do sistema..."
cat > /var/www/html/sistema/system-check.php << 'EOL'
<?php
header('Content-Type: text/html; charset=utf-8');

echo "<h1>Track'n'Me - Verificação do Sistema</h1>";

// Verificar versão do PHP
echo "<h2>Versão do PHP</h2>";
echo "<p>Versão atual: " . phpversion() . "</p>";
if (version_compare(phpversion(), '8.0.0', '>=')) {
    echo "<p style='color:green'>✓ Versão do PHP compatível</p>";
} else {
    echo "<p style='color:red'>✗ PHP 8.0 ou superior requerido</p>";
}

// Verificar extensões PHP
echo "<h2>Extensões PHP</h2>";
$required_extensions = ['mysqli', 'pdo', 'pdo_mysql', 'json', 'mbstring', 'xml', 'curl'];
echo "<ul>";
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<li style='color:green'>✓ $ext - Instalada</li>";
    } else {
        echo "<li style='color:red'>✗ $ext - Não instalada</li>";
    }
}
echo "</ul>";

// Verificar conexão com o banco de dados
echo "<h2>Conexão com o Banco de Dados</h2>";
try {
    $conn = new mysqli("localhost", "checklist_user", "sua_senha_segura", "checklist_manager");
    if ($conn->connect_error) {
        throw new Exception("Conexão falhou: " . $conn->connect_error);
    }
    echo "<p style='color:green'>✓ Conexão com o banco de dados estabelecida</p>";
    
    // Verificar tabelas
    $tables = ["usuarios", "checklists", "veiculos", "invoices", "whatsapp_config", "system_config", "sim_cards", "operators", "scheduling", "scheduling_config"];
    echo "<h3>Tabelas do Banco de Dados</h3>";
    echo "<ul>";
    foreach ($tables as $table) {
        $result = $conn->query("SHOW TABLES LIKE '$table'");
        if ($result->num_rows > 0) {
            $count = $conn->query("SELECT COUNT(*) as count FROM $table")->fetch_assoc()['count'];
            echo "<li style='color:green'>✓ Tabela '$table' - $count registros</li>";
        } else {
            echo "<li style='color:red'>✗ Tabela '$table' não encontrada</li>";
        }
    }
    echo "</ul>";
    
    $conn->close();
} catch (Exception $e) {
    echo "<p style='color:red'>✗ " . $e->getMessage() . "</p>";
}

// Verificar permissões de diretórios
echo "<h2>Permissões de Diretórios</h2>";
$app_dir = __DIR__;
$api_dir = __DIR__ . '/api';
$upload_dir = __DIR__ . '/uploads';

echo "<ul>";
echo "<li>Diretório da aplicação: $app_dir</li>";
echo "<li>Permissões: " . substr(sprintf('%o', fileperms($app_dir)), -4) . "</li>";

if (is_writable($app_dir)) {
    echo "<li style='color:green'>✓ Diretório da aplicação é gravável</li>";
} else {
    echo "<li style='color:red'>✗ Diretório da aplicação não é gravável</li>";
}

if (file_exists($api_dir)) {
    echo "<li style='color:green'>✓ Diretório API existe</li>";
    if (is_writable($api_dir)) {
        echo "<li style='color:green'>✓ Diretório API é gravável</li>";
    } else {
        echo "<li style='color:red'>✗ Diretório API não é gravável</li>";
    }
} else {
    echo "<li style='color:red'>✗ Diretório API não existe</li>";
}

if (!file_exists($upload_dir)) {
    if (mkdir($upload_dir, 0755, true)) {
        echo "<li style='color:green'>✓ Diretório de uploads criado</li>";
    } else {
        echo "<li style='color:red'>✗ Não foi possível criar o diretório de uploads</li>";
    }
} else {
    echo "<li style='color:green'>✓ Diretório de uploads existe</li>";
    if (is_writable($upload_dir)) {
        echo "<li style='color:green'>✓ Diretório de uploads é gravável</li>";
    } else {
        echo "<li style='color:red'>✗ Diretório de uploads não é gravável</li>";
    }
}
echo "</ul>";

// Verificar configuração do servidor
echo "<h2>Configuração do Servidor</h2>";
echo "<ul>";
echo "<li>Servidor: " . $_SERVER['SERVER_SOFTWARE'] . "</li>";
echo "<li>Sistema Operacional: " . PHP_OS . "</li>";
echo "<li>Limite de Memória PHP: " . ini_get('memory_limit') . "</li>";
echo "<li>Tempo Máximo de Execução: " . ini_get('max_execution_time') . " segundos</li>";
echo "<li>Tamanho Máximo de Upload: " . ini_get('upload_max_filesize') . "</li>";
echo "<li>Tamanho Máximo de POST: " . ini_get('post_max_size') . "</li>";
echo "</ul>";

// Verificar mod_rewrite
echo "<h2>Mod Rewrite</h2>";
if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    if (in_array('mod_rewrite', $modules)) {
        echo "<p style='color:green'>✓ mod_rewrite está ativado</p>";
    } else {
        echo "<p style='color:red'>✗ mod_rewrite não está ativado</p>";
    }
} else {
    echo "<p>Não foi possível verificar mod_rewrite. Se estiver usando PHP-FPM, isso é normal.</p>";
}

// Verificar URL da aplicação
echo "<h2>URL da Aplicação</h2>";
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];
$uri = rtrim(dirname($_SERVER['PHP_SELF']), '/');
$app_url = "$protocol://$host$uri";
echo "<p>URL da aplicação: $app_url</p>";

echo "<h2>Próximos Passos</h2>";
echo "<ol>";
echo "<li>Se todos os requisitos estiverem atendidos, remova este arquivo de verificação.</li>";
echo "<li>Verifique se a aplicação está funcionando corretamente em <a href='$app_url'>$app_url</a>.</li>";
echo "<li>Configure backups regulares do banco de dados.</li>";
echo "<li>Altere a senha do usuário admin após o primeiro login.</li>";
echo "</ol>";

echo "<p><a href='$app_url'>Ir para a aplicação</a></p>";
?>
EOL

# Permissões
echo "Configurando permissões..."
sudo chown -R www-data:www-data /var/www/html/sistema
sudo find /var/www/html/sistema -type f -exec chmod 644 {} \;
sudo find /var/www/html/sistema -type d -exec chmod 755 {} \;
sudo chmod +x /var/www/html/sistema/server-setup.sh

# Reiniciar Apache
echo "Reiniciando Apache..."
sudo systemctl restart apache2

echo "Configuração do servidor concluída!"
echo "Para finalizar a configuração, acesse: https://app8.narrota.com.br/db_setup.php"
echo "Depois, verifique o status do sistema em: https://app8.narrota.com.br/system-check.php"
echo "IMPORTANTE: Após a configuração, remova os arquivos db_setup.php e system-check.php por segurança!"

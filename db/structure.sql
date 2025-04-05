
-- Database structure for Track'n'Me System
-- Updated on 2025-04-05

-- Drop tables if they exist (in reverse order of dependencies)
SET FOREIGN_KEY_CHECKS = 0;

-- Users table
CREATE TABLE IF NOT EXISTS usuarios (
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
);

-- Checklists table
CREATE TABLE IF NOT EXISTS checklists (
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
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS veiculos (
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
);

-- Invoices table
CREATE TABLE IF NOT EXISTS faturas (
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
    email VARCHAR(100),
    phone VARCHAR(20),
    billing_type ENUM('BOLETO', 'PIX', 'CREDIT_CARD') DEFAULT 'BOLETO',
    asaas_id VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES usuarios(id),
    FOREIGN KEY (reseller_id) REFERENCES usuarios(id),
    FOREIGN KEY (checklist_id) REFERENCES checklists(id) ON DELETE SET NULL
);

-- WhatsApp configuration table
CREATE TABLE IF NOT EXISTS whatsapp_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    instance VARCHAR(100) NOT NULL DEFAULT 'default',
    base_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

-- System configuration table
CREATE TABLE IF NOT EXISTS system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Resellers table
CREATE TABLE IF NOT EXISTS revendas (
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
);

-- Reseller clients table
CREATE TABLE IF NOT EXISTS reseller_clients (
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
);

-- Asaas configuration table
CREATE TABLE IF NOT EXISTS asaas_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    sandbox BOOLEAN NOT NULL DEFAULT 1,
    user_role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

-- SIM cards table
CREATE TABLE IF NOT EXISTS sim_cards (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES usuarios(id)
);

-- Operators table
CREATE TABLE IF NOT EXISTS operators (
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
);

-- Scheduling table
CREATE TABLE IF NOT EXISTS scheduling (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES usuarios(id),
    FOREIGN KEY (technician_id) REFERENCES usuarios(id)
);

-- Scheduling configuration table
CREATE TABLE IF NOT EXISTS scheduling_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_type VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    available_days VARCHAR(20) DEFAULT '1,2,3,4,5', -- days of week available
    start_time TIME DEFAULT '09:00:00',
    end_time TIME DEFAULT '18:00:00',
    max_daily_appointments INT DEFAULT 10,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO usuarios (username, password, role)
SELECT 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'admin');

-- Insert example operators
INSERT INTO operators (name, api_url, active)
VALUES 
  ('Vivo', 'https://api.vivo.com.br', 1),
  ('Claro', 'https://api.claro.com.br', 1),
  ('TIM', 'https://api.tim.com.br', 1),
  ('Oi', 'https://api.oi.com.br', 1),
  ('Linkfields', 'https://api.linkfields.com', 1),
  ('Arqia', 'https://api.arqia.com.br', 1),
  ('Transmeet', 'https://api.transmeet.com', 1),
  ('Hinova', 'https://api.hinova.com.br', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert WhatsApp global API key
INSERT INTO system_config (config_key, config_value, description)
VALUES ('whatsapp_global_api_key', 'd9919cda7e370839d33b8946584dac93', 'Chave global da API do WhatsApp')
ON DUPLICATE KEY UPDATE config_value = VALUES(config_value);

SET FOREIGN_KEY_CHECKS = 1;

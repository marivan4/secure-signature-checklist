
# Track'n'Me - Guia de Implantação

Este documento descreve os passos necessários para implantar o sistema Track'n'Me em um servidor Ubuntu 22.04 com Apache e MySQL.

## Configuração do Servidor

### Requisitos

- Ubuntu Server 22.04 LTS
- Apache 2.4+
- PHP 8.0+ com extensões: mysqli, pdo, json, mbstring, xml, curl
- MySQL 8.0+
- Acesso root ao servidor
- Domínio configurado (app8.narrota.com.br)

### Passo 1: Preparar o Servidor

```bash
# Atualizar pacotes do sistema
sudo apt update
sudo apt upgrade -y

# Instalar Apache, PHP e extensões
sudo apt install -y apache2 php8.1 php8.1-mysql php8.1-curl php8.1-xml php8.1-mbstring php8.1-gd php8.1-zip php8.1-intl php8.1-bcmath libapache2-mod-php8.1

# Instalar MySQL
sudo apt install -y mysql-server

# Configurar MySQL para segurança
sudo mysql_secure_installation

# Habilitar módulos Apache necessários
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl restart apache2
```

### Passo 2: Configurar o Virtual Host

```bash
# Criar arquivo de configuração do site
sudo nano /etc/apache2/sites-available/narrota.conf

# Adicione a seguinte configuração:
<VirtualHost *:80>
    ServerName app8.narrota.com.br
    DocumentRoot /var/www/html/fatura/public
    
    <Directory /var/www/html/fatura/public>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/narrota-error.log
    CustomLog ${APACHE_LOG_DIR}/narrota-access.log combined
</VirtualHost>

# Ativar o site e reiniciar Apache
sudo a2ensite narrota.conf
sudo systemctl restart apache2
```

### Passo 3: Criar Banco de Dados e Usuário

```bash
# Acessar o MySQL como root
sudo mysql

# No console do MySQL, execute:
CREATE DATABASE checklist_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'checklist_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON checklist_manager.* TO 'checklist_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Passo 4: Copiar os arquivos para o servidor

```bash
# Criar diretório para o sistema
sudo mkdir -p /var/www/html/fatura

# Copiar todos os arquivos do build e backend para o servidor
scp -r * usuario@app8.narrota.com.br:/var/www/html/fatura/

# Configurar permissões
ssh usuario@app8.narrota.com.br 'sudo chown -R www-data:www-data /var/www/html/fatura'
```

### Passo 5: Configurar o certificado SSL

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-apache

# Obter certificado SSL
sudo certbot --apache -d app8.narrota.com.br
```

### Passo 6: Configurar o banco de dados

Acesse a URL:
```
https://app8.narrota.com.br/db_setup.php
```

Este script irá:
- Criar as tabelas no banco de dados
- Inserir dados iniciais
- Criar usuários de teste
- Configurar a estrutura de diretórios

### Passo 7: Verificar a instalação

Acesse a URL:
```
https://app8.narrota.com.br/system-check.php
```

Verifique se todos os requisitos são atendidos e corrija quaisquer problemas encontrados.

### Passo 8: Remover arquivos de configuração

```bash
# Conectar ao servidor
ssh usuario@app8.narrota.com.br

# Remover arquivos de configuração
sudo rm /var/www/html/fatura/public/db_setup.php
sudo rm /var/www/html/fatura/public/system-check.php
```

## Estrutura de Diretórios

```
/var/www/html/fatura/
├── public/             # Diretório público acessível via web
│   ├── api/            # Backend PHP
│   │   ├── config/     # Configurações do backend
│   │   ├── checklists/ # APIs de checklists
│   │   └── ...
│   ├── assets/         # Arquivos estáticos (CSS, JS, imagens)
│   ├── uploads/        # Diretório para uploads
│   └── index.html      # Ponto de entrada da aplicação React
└── db/                 # Arquivos do banco de dados
    └── structure.sql   # Estrutura do banco de dados
```

## Configuração de Backup

### Backup diário do banco de dados

```bash
# Criar script de backup
sudo nano /etc/cron.daily/backup-tracknme-db

# Adicionar o conteúdo:
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d")
BACKUP_DIR="/var/backups/tracknme"
mkdir -p $BACKUP_DIR
mysqldump -u checklist_user -p'sua_senha_segura' checklist_manager > $BACKUP_DIR/db_backup_$TIMESTAMP.sql
find $BACKUP_DIR -type f -name "db_backup_*" -mtime +30 -delete

# Tornar o script executável
sudo chmod +x /etc/cron.daily/backup-tracknme-db
```

## Acesso Inicial

- URL: https://app8.narrota.com.br
- Usuário: admin
- Senha: admin

**IMPORTANTE**: Altere a senha do administrador imediatamente após o primeiro login.

## Monitoramento e manutenção

### Verificar logs do Apache

```bash
sudo tail -f /var/log/apache2/narrota-error.log
```

### Verificar status do serviço

```bash
sudo systemctl status apache2
sudo systemctl status mysql
```

### Reiniciar serviços

```bash
sudo systemctl restart apache2
sudo systemctl restart mysql
```

## Solução de Problemas

### Problema: Acesso negado ao banco de dados

```bash
# Verificar se o usuário existe
sudo mysql -e "SELECT user,host FROM mysql.user WHERE user='checklist_user';"

# Recriar o usuário se necessário
sudo mysql -e "CREATE USER 'checklist_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';"
sudo mysql -e "GRANT ALL PRIVILEGES ON checklist_manager.* TO 'checklist_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

### Problema: Diretório API não existe

```bash
# Criar diretório API e configurar permissões
sudo mkdir -p /var/www/html/fatura/public/api/config
sudo chown -R www-data:www-data /var/www/html/fatura/public/api
```

### Problema: Permissões de arquivos

```bash
# Corrigir permissões
sudo find /var/www/html/fatura -type f -exec chmod 644 {} \;
sudo find /var/www/html/fatura -type d -exec chmod 755 {} \;
sudo chmod -R 775 /var/www/html/fatura/public/uploads
```

## Suporte

Para obter suporte, entre em contato através do email: suporte@narrota.com.br

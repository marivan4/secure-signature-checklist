
# Manual de Instalação - Sistema Track'n'Me

## Requisitos do Sistema

- Ubuntu Server 22.04 LTS
- Apache 2.4+
- PHP 8.0+ com extensões: mysqli, pdo, json, mbstring, xml, curl
- MySQL 8.0+
- Acesso root ao servidor
- Domínio configurado (ex: app8.narrota.com.br)

## Passo 1: Preparação do Servidor

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

## Passo 2: Configuração do Virtual Host

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

## Passo 3: Obter Certificado SSL

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-apache

# Obter certificado SSL
sudo certbot --apache -d app8.narrota.com.br

# Verificar renovação automática
sudo certbot renew --dry-run
```

## Passo 4: Copiar os Arquivos para o Servidor

```bash
# Criar diretório para o sistema
sudo mkdir -p /var/www/html/fatura

# Copiar todos os arquivos para o servidor
# Se estiver usando um arquivo ZIP:
sudo unzip track-n-me.zip -d /var/www/html/fatura/

# OU via git:
sudo git clone https://github.com/seu-usuario/track-n-me.git /var/www/html/fatura/

# Configurar permissões
sudo chown -R www-data:www-data /var/www/html/fatura
sudo find /var/www/html/fatura -type d -exec chmod 755 {} \;
sudo find /var/www/html/fatura -type f -exec chmod 644 {} \;
```

## Passo 5: Configurar Estrutura de Diretórios

Acesse a URL abaixo para criar automaticamente todos os diretórios necessários:

```
https://app8.narrota.com.br/create_directories.php
```

Este script criará:
- Diretórios da API (/api e subdiretórios)
- Diretórios de uploads (/uploads e subdiretórios)

## Passo 6: Configurar o Banco de Dados

```bash
# Editar o arquivo setup_mysql.php se necessário
sudo nano /var/www/html/fatura/public/setup_mysql.php

# Verifique as configurações da variável $root_password
```

Acesse a URL abaixo para configurar o banco de dados:

```
https://app8.narrota.com.br/setup_mysql.php
```

Este script irá:
- Criar o banco de dados `checklist_manager`
- Criar o usuário `checklist_user` com uma senha segura
- Conceder privilégios ao usuário
- Testar a conexão

**Nota:** A senha é definida no arquivo como `Track2025!#Secure@Pwd`. Esta senha atende aos requisitos de segurança do MySQL.

## Passo 7: Verificar a Instalação

Acesse a URL abaixo para verificar se todos os requisitos estão atendidos:

```
https://app8.narrota.com.br/system-check.php
```

Verifique se todos os itens estão marcados como "✓" (verificado) e corrija quaisquer problemas encontrados.

## Passo 8: Configuração Final

### Remover Arquivos de Instalação

Após a instalação bem-sucedida, remova os arquivos de instalação por segurança:

```bash
sudo rm /var/www/html/fatura/public/setup_mysql.php
sudo rm /var/www/html/fatura/public/create_directories.php
sudo rm /var/www/html/fatura/public/system-check.php
```

### Configurar Backups

Crie um script para backup diário do banco de dados:

```bash
sudo nano /etc/cron.daily/backup-tracknme-db
```

Adicione o seguinte conteúdo:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d")
BACKUP_DIR="/var/backups/tracknme"
mkdir -p $BACKUP_DIR
mysqldump -u checklist_user -p'Track2025!#Secure@Pwd' checklist_manager > $BACKUP_DIR/db_backup_$TIMESTAMP.sql
find $BACKUP_DIR -type f -name "db_backup_*" -mtime +30 -delete
```

Torne o script executável:

```bash
sudo chmod +x /etc/cron.daily/backup-tracknme-db
```

## Estrutura de Diretórios

Após a instalação, a estrutura de diretórios deve ser:

```
/var/www/html/fatura/
├── public/                  # Diretório público acessível via web
│   ├── api/                 # Backend PHP
│   │   ├── config/          # Configurações do backend
│   │   ├── checklists/      # APIs de checklists
│   │   ├── clients/         # APIs de clientes
│   │   ├── invoices/        # APIs de faturas
│   │   ├── trackers/        # APIs de rastreadores
│   │   ├── users/           # APIs de usuários
│   │   └── vehicles/        # APIs de veículos
│   ├── uploads/             # Diretório para uploads
│   │   ├── logos/           # Logos de empresas/clientes
│   │   ├── signatures/      # Assinaturas digitalizadas
│   │   └── documents/       # Documentos diversos
│   ├── assets/              # Arquivos estáticos (CSS, JS, imagens)
│   └── index.html           # Ponto de entrada da aplicação
```

## Acesso Inicial

Após a instalação, acesse o sistema:

```
https://app8.narrota.com.br
```

Credenciais padrão:
- Usuário: admin
- Senha: admin

**IMPORTANTE:** Altere a senha do administrador imediatamente após o primeiro login.

## Solução de Problemas

### Problema: Acesso negado ao banco de dados

```bash
# Verificar se o usuário existe
sudo mysql -e "SELECT user,host FROM mysql.user WHERE user='checklist_user';"

# Recriar o usuário se necessário
sudo mysql -e "DROP USER IF EXISTS 'checklist_user'@'localhost';"
sudo mysql -e "CREATE USER 'checklist_user'@'localhost' IDENTIFIED BY 'Track2025!#Secure@Pwd';"
sudo mysql -e "GRANT ALL PRIVILEGES ON checklist_manager.* TO 'checklist_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

### Problema: Diretório API não existe

```bash
# Criar diretórios manualmente
sudo mkdir -p /var/www/html/fatura/public/api/config
sudo mkdir -p /var/www/html/fatura/public/api/checklists
sudo mkdir -p /var/www/html/fatura/public/api/clients
sudo mkdir -p /var/www/html/fatura/public/api/invoices
sudo mkdir -p /var/www/html/fatura/public/api/trackers
sudo mkdir -p /var/www/html/fatura/public/api/users
sudo mkdir -p /var/www/html/fatura/public/api/vehicles

# Configurar permissões
sudo chown -R www-data:www-data /var/www/html/fatura/public/api
```

### Problema: Permissões de arquivos

```bash
# Corrigir permissões
sudo find /var/www/html/fatura -type f -exec chmod 644 {} \;
sudo find /var/www/html/fatura -type d -exec chmod 755 {} \;
sudo chmod -R 775 /var/www/html/fatura/public/uploads
```

### Problema: Páginas não carregam corretamente (erro 404)

```bash
# Verificar se o mod_rewrite está ativado
sudo a2enmod rewrite

# Verificar a configuração do .htaccess
cat /var/www/html/fatura/public/.htaccess

# Reiniciar o Apache
sudo systemctl restart apache2
```

## Suporte

Para obter suporte, entre em contato através do email: suporte@narrota.com.br

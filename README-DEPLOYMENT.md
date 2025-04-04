
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

### Passo a Passo

1. **Copiar os arquivos para o servidor**

```bash
# Copiar todos os arquivos do build e backend para o servidor
scp -r * usuario@seu-servidor:/var/www/html/sistema/
```

2. **Executar o script de configuração do servidor**

```bash
# Conectar ao servidor
ssh usuario@seu-servidor

# Navegar até o diretório do sistema
cd /var/www/html/sistema

# Tornar o script executável
chmod +x server-setup.sh

# Executar o script
sudo ./server-setup.sh
```

3. **Configurar o certificado SSL**

```bash
sudo certbot --apache -d app8.narrota.com.br
```

4. **Configurar o banco de dados**

Acesse a URL:
```
https://app8.narrota.com.br/db_setup.php
```

5. **Verificar a instalação**

Acesse a URL:
```
https://app8.narrota.com.br/system-check.php
```

6. **Remover arquivos de configuração**

```bash
sudo rm /var/www/html/sistema/db_setup.php
sudo rm /var/www/html/sistema/system-check.php
```

## Estrutura de Diretórios

```
/var/www/html/sistema/
├── api/               # Backend PHP
│   ├── config/        # Configurações do backend
│   ├── checklists/    # APIs de checklists
│   └── ...
├── assets/            # Arquivos estáticos (CSS, JS, imagens)
├── uploads/           # Diretório para uploads
└── index.html         # Ponto de entrada da aplicação React
```

## Acesso Inicial

- URL: https://app8.narrota.com.br
- Usuário: admin
- Senha: admin

**IMPORTANTE**: Altere a senha do administrador imediatamente após o primeiro login.

## Solução de Problemas

### Logs do Apache

```bash
sudo tail -f /var/log/apache2/narrota-error.log
```

### Logs do PHP

```bash
sudo tail -f /var/log/php/error.log
```

### Problemas de Permissão

```bash
# Corrigir permissões
sudo chown -R www-data:www-data /var/www/html/sistema
sudo find /var/www/html/sistema -type f -exec chmod 644 {} \;
sudo find /var/www/html/sistema -type d -exec chmod 755 {} \;
```

### Problemas de Conexão com o Banco de Dados

Verifique o arquivo de configuração:
```bash
sudo nano /var/www/html/sistema/api/config/database.php
```

## Manutenção

### Backups diários do banco de dados

```bash
# Criar script de backup
sudo nano /etc/cron.daily/backup-tracknme-db

# Adicionar o conteúdo:
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d")
BACKUP_DIR="/var/backups/tracknme"
mkdir -p $BACKUP_DIR
mysqldump -u checklist_user -p'sua_senha_segura' checklist_manager > $BACKUP_DIR/db_backup_$TIMESTAMP.sql

# Tornar executável
sudo chmod +x /etc/cron.daily/backup-tracknme-db
```

## Suporte

Para obter suporte, entre em contato através do email: suporte@narrota.com.br

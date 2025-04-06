
# Manual de Instalação - Track'n'Me

Este documento contém instruções detalhadas para a instalação e configuração do sistema Track'n'Me.

## Requisitos do Sistema

- Node.js 18.x ou superior
- NPM 9.x ou superior (ou Yarn 1.22.x)
- PHP 8.0 ou superior (para a API)
- MySQL 8.0 ou superior
- Servidor web (Apache ou Nginx)

## Passos para Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/track-n-me.git
cd track-n-me
```

### 2. Instalação das dependências front-end

```bash
# Usando NPM
npm install

# OU usando Yarn
yarn install
```

### 3. Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_API_BASE_URL=http://seu-dominio.com/api
VITE_ASAAS_API_URL=https://sandbox.asaas.com/api/v3
VITE_ASAAS_API_KEY=sua_api_key_do_asaas
VITE_WHATSAPP_API_URL=https://api.whatsapp.com
VITE_WHATSAPP_API_TOKEN=seu_token_whatsapp
```

### 4. Construção do front-end

```bash
# Para desenvolvimento
npm run dev

# Para produção
npm run build
```

### 5. Configuração do servidor web

#### Para Apache:

Certifique-se que o arquivo `.htaccess` está na pasta `public/` com o seguinte conteúdo:

```apache
# Enable rewrite engine
RewriteEngine On

# If the request is for an actual file or directory, serve it directly
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# If the request is for a PHP file in the API directory, serve it directly
RewriteRule ^api/.*\.php$ - [L]

# If the request begins with /api/, serve files in the API directory
RewriteRule ^api/ - [L]

# Otherwise, redirect all requests to index.html
RewriteRule ^ index.html [L]
```

#### Para Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /caminho/para/a/pasta/public;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        try_files $uri $uri/ /api/index.php?$query_string;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_pass unix:/run/php/php8.0-fpm.sock; # Ajuste conforme sua versão do PHP
    }
}
```

### 6. Configuração do banco de dados

1. Certifique-se de que o MySQL esteja instalado e em execução
2. Acesse o MySQL e execute os seguintes comandos:

```sql
CREATE DATABASE checklist_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'checklist_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON checklist_manager.* TO 'checklist_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Importe a estrutura do banco de dados:

```bash
mysql -u checklist_user -p'sua_senha_segura' checklist_manager < db/structure.sql
```

Alternativamente, acesse o instalador web em:

```
http://seu-dominio.com/db_setup.php
```

### 7. Configuração da API

1. Crie o diretório da API e configuração do banco de dados:

```bash
mkdir -p public/api/config
mkdir -p public/uploads
chmod -R 775 public/uploads
```

2. Crie o arquivo de configuração do banco de dados:

```bash
nano public/api/config/database.php
```

Adicione o seguinte conteúdo:

```php
<?php
// Database Configuration
return [
    'host' => 'localhost',
    'database' => 'checklist_manager',
    'username' => 'checklist_user',
    'password' => 'sua_senha_segura',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci'
];
```

### 8. Verificação do sistema

Acesse `http://seu-dominio.com/system-check.php` para verificar se tudo está configurado corretamente.

Este script irá verificar:
- Versão do PHP
- Extensões PHP necessárias
- Conexão com o banco de dados
- Estrutura das tabelas
- Permissões de diretórios
- Configuração do servidor web

### 9. Permissões de diretórios

Certifique-se de que os diretórios do sistema possuam as permissões corretas:

```bash
# Ajuste o dono dos arquivos para o usuário do servidor web
chown -R www-data:www-data /caminho/para/o/projeto

# Defina permissões apropriadas
find /caminho/para/o/projeto -type f -exec chmod 644 {} \;
find /caminho/para/o/projeto -type d -exec chmod 755 {} \;

# Certifique-se que o diretório de uploads seja gravável
chmod -R 775 /caminho/para/o/projeto/public/uploads
```

### 10. Credenciais padrão

O sistema é instalado com os seguintes usuários padrão:

| Usuário     | Senha       | Função       |
|-------------|-------------|--------------|
| admin       | admin       | Administrador|
| manager     | manager     | Gerente      |
| client      | client      | Cliente      |
| reseller    | reseller    | Revendedor   |
| endclient   | endclient   | Cliente Final|

**IMPORTANTE:** Altere estas senhas após o primeiro login!

## Configurações adicionais

### Integração com Asaas

1. Crie uma conta na plataforma Asaas (https://www.asaas.com)
2. Obtenha sua chave de API no painel Asaas
3. Configure a chave na página de Integrações do sistema

### Integração com WhatsApp

1. Obtenha credenciais da API do WhatsApp Business
2. Configure as credenciais na página de Integrações do sistema

## Resolução de problemas comuns

### Problema: Erro de conexão com banco de dados
- Verifique as credenciais no arquivo `public/api/config/database.php`
- Certifique-se que o usuário MySQL tem permissões adequadas
- Execute o comando para verificar se o usuário existe:
  ```sql
  SELECT user FROM mysql.user WHERE user = 'checklist_user';
  ```

### Problema: Páginas não carregam corretamente
- Verifique se o arquivo `.htaccess` está configurado corretamente
- Certifique-se que o mod_rewrite está habilitado no Apache:
  ```bash
  sudo a2enmod rewrite
  sudo systemctl restart apache2
  ```

### Problema: API retornando erro 500
- Verifique os logs de erro do PHP
- No Ubuntu/Debian: `sudo tail -f /var/log/apache2/error.log`
- Certifique-se que todas as extensões PHP necessárias estão instaladas

## Suporte e contato

Para obter suporte, entre em contato através do email suporte@narrota.com.br


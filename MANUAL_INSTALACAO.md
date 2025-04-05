
# Manual de Instalação - Sistema de Gestão de Rastreadores

Este documento contém instruções detalhadas para a instalação e configuração do sistema.

## Requisitos do Sistema

- Node.js 18.x ou superior
- NPM 9.x ou superior (ou Yarn 1.22.x)
- PHP 8.0 ou superior (para a API)
- MySQL 8.0 ou superior
- Servidor web (Apache ou Nginx)

## Passos para Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
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

### 4. Configuração do banco de dados

1. Crie um banco de dados MySQL para o projeto
2. Configure as credenciais no arquivo `public/api/config/database.php`:

```php
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'nome_do_banco');
define('DB_USER', 'usuario_mysql');
define('DB_PASS', 'senha_mysql');
```

3. Execute o script de configuração do banco de dados acessando:
   ```
   http://seu-dominio.com/db_setup.php
   ```

4. Após a conclusão, remova o arquivo `db_setup.php` por segurança:
   ```bash
   rm public/db_setup.php
   ```

### 5. Configuração do servidor web

#### Para Apache:
Certifique-se que o arquivo `.htaccess` está na pasta `public/` com o seguinte conteúdo:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# PHP API redirects
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^api/(.*)$ api/$1 [L]
</IfModule>
```

#### Para Nginx:
Adicione a seguinte configuração ao seu arquivo de site:

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

### 6. Compilação do front-end

```bash
# Para ambiente de desenvolvimento
npm run dev

# Para ambiente de produção
npm run build
```

### 7. Testando a instalação

1. Acesse o front-end em `http://seu-dominio.com`
2. Teste a API acessando `http://seu-dominio.com/api/test-connection.php`
3. Verifique a configuração do sistema em `http://seu-dominio.com/system-check.php`

### 8. Credenciais padrão

O sistema é instalado com os seguintes usuários padrão:

| Usuário     | Senha       | Função       |
|-------------|-------------|--------------|
| admin       | admin       | Administrador|
| manager     | manager     | Gerente      |
| client      | client      | Cliente      |
| reseller    | reseller    | Revendedor   |
| endclient   | endclient   | Cliente Final|

**IMPORTANTE:** Altere estas senhas após o primeiro login!

### 9. Configurações adicionais

#### Integração com Asaas

1. Crie uma conta na plataforma Asaas (https://www.asaas.com)
2. Obtenha sua chave de API no painel Asaas
3. Configure a chave na página de Integrações do sistema

#### Integração com WhatsApp

1. Obtenha credenciais da API do WhatsApp Business
2. Configure as credenciais na página de Integrações do sistema

## Atualizações do sistema

Para atualizar o sistema para uma nova versão:

1. Faça backup do banco de dados
2. Faça backup dos arquivos de configuração
3. Atualize o repositório com `git pull`
4. Atualize as dependências com `npm install`
5. Recompile o front-end com `npm run build`
6. Execute as migrações do banco de dados se necessário

## Resolução de problemas comuns

### Problema: Erro de conexão com banco de dados
- Verifique as credenciais no arquivo `public/api/config/database.php`
- Certifique-se que o usuário MySQL tem permissões adequadas

### Problema: Rotas não funcionam após recarregar a página
- Verifique se o arquivo `.htaccess` está configurado corretamente
- Certifique-se que o mod_rewrite está habilitado no Apache

### Problema: API retornando erro 500
- Verifique os logs de erro do PHP
- Certifique-se que todas as extensões PHP necessárias estão instaladas

## Suporte e contato

Para obter suporte, entre em contato através do email suporte@exemplo.com ou pelo telefone (11) 9999-9999.


<?php
header('Content-Type: text/html; charset=utf-8');

echo "<h1>Track'n'Me - Verificação do Sistema</h1>";

// Verificar versão do PHP
echo "<h2>Versão do PHP</h2>";
echo "<p>Versão atual: " . phpversion() . "</p>";
if (version_compare(phpversion(), '8.0.0', '>=')) {
    echo "<p class='success'>✅ Versão do PHP compatível</p>";
} else {
    echo "<p class='error'>❌ PHP 8.0 ou superior requerido</p>";
}

// Verificar extensões PHP
echo "<h2>Extensões PHP</h2>";
$required_extensions = ['mysqli', 'pdo', 'json', 'mbstring', 'xml', 'curl'];
echo "<ul>";
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<li class='success'>✅ $ext - Instalada</li>";
    } else {
        echo "<li class='error'>❌ $ext - Não instalada</li>";
    }
}
echo "</ul>";

// Verificar conexão com o banco de dados
echo "<h2>Conexão com o Banco de Dados</h2>";
try {
    // Configuração do banco de dados
    $db_config_file = __DIR__ . '/api/config/database.php';
    if (file_exists($db_config_file)) {
        include $db_config_file;
        if (defined('DB_HOST') && defined('DB_NAME') && defined('DB_USER') && defined('DB_PASS')) {
            echo "<p>Usando configurações do arquivo database.php</p>";
            $host = DB_HOST;
            $dbname = DB_NAME;
            $username = DB_USER;
            $password = DB_PASS;
        } else {
            throw new Exception("Arquivo de configuração do banco de dados não define as constantes necessárias");
        }
    } else {
        echo "<p>Arquivo de configuração não encontrado, usando valores padrão</p>";
        $host = "localhost";
        $dbname = "checklist_manager";
        $username = "checklist_user";
        $password = "sua_senha_segura";
    }

    $conn = new mysqli($host, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Conexão falhou: " . $conn->connect_error);
    }
    echo "<p class='success'>✅ Conexão com o banco de dados estabelecida</p>";
    
    // Verificar tabelas
    $tables = ["usuarios", "checklists", "veiculos", "faturas", "whatsapp_config", 
               "system_config", "sim_cards", "operators", "scheduling", "scheduling_config", 
               "revendas", "reseller_clients", "asaas_config"];
    echo "<h3>Tabelas do Banco de Dados</h3>";
    echo "<ul>";
    foreach ($tables as $table) {
        $result = $conn->query("SHOW TABLES LIKE '$table'");
        if ($result->num_rows > 0) {
            $count = $conn->query("SELECT COUNT(*) as count FROM $table")->fetch_assoc()['count'];
            echo "<li class='success'>✅ Tabela '$table' - $count registros</li>";
        } else {
            echo "<li class='error'>❌ Tabela '$table' não encontrada</li>";
        }
    }
    echo "</ul>";
    
    $conn->close();
} catch (Exception $e) {
    echo "<p class='error'>❌ " . $e->getMessage() . "</p>";
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
    echo "<li class='success'>✅ Diretório da aplicação é gravável</li>";
} else {
    echo "<li class='error'>❌ Diretório da aplicação não é gravável</li>";
}

if (file_exists($api_dir)) {
    echo "<li class='success'>✅ Diretório API existe</li>";
    if (is_writable($api_dir)) {
        echo "<li class='success'>✅ Diretório API é gravável</li>";
    } else {
        echo "<li class='error'>❌ Diretório API não é gravável</li>";
    }
} else {
    echo "<li class='error'>❌ Diretório API não existe</li>";
}

if (!file_exists($upload_dir)) {
    if (mkdir($upload_dir, 0755, true)) {
        echo "<li class='success'>✅ Diretório de uploads criado</li>";
    } else {
        echo "<li class='error'>❌ Não foi possível criar o diretório de uploads</li>";
    }
} else {
    echo "<li class='success'>✅ Diretório de uploads existe</li>";
    if (is_writable($upload_dir)) {
        echo "<li class='success'>✅ Diretório de uploads é gravável</li>";
    } else {
        echo "<li class='error'>❌ Diretório de uploads não é gravável</li>";
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
        echo "<p class='success'>✅ mod_rewrite está ativado</p>";
    } else {
        echo "<p class='error'>❌ mod_rewrite não está ativado</p>";
    }
} else {
    echo "<p class='notice'>ℹ️ Não foi possível verificar mod_rewrite. Se estiver usando PHP-FPM, isso é normal.</p>";
}

// Verificar URL da aplicação
echo "<h2>URL da Aplicação</h2>";
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];
$uri = rtrim(dirname($_SERVER['PHP_SELF']), '/');
$app_url = "$protocol://$host$uri";
echo "<p>URL da aplicação: $app_url</p>";

// Verificar arquivo .env
echo "<h2>Arquivo de Configuração .env</h2>";
$env_file = dirname(__DIR__) . '/.env';
if (file_exists($env_file)) {
    echo "<p class='success'>✅ Arquivo .env encontrado</p>";
    if (is_readable($env_file)) {
        echo "<p class='success'>✅ Arquivo .env pode ser lido</p>";
        $env_content = file_get_contents($env_file);
        $env_vars = [
            'VITE_API_BASE_URL',
            'VITE_ASAAS_API_URL',
            'VITE_ASAAS_API_KEY',
            'VITE_WHATSAPP_API_URL',
            'VITE_WHATSAPP_API_TOKEN'
        ];
        echo "<p>Verificando variáveis de ambiente:</p>";
        echo "<ul>";
        foreach ($env_vars as $var) {
            if (preg_match("/$var=/", $env_content)) {
                echo "<li class='success'>✅ $var - Configurado</li>";
            } else {
                echo "<li class='error'>❌ $var - Não configurado</li>";
            }
        }
        echo "</ul>";
    } else {
        echo "<p class='error'>❌ Arquivo .env não pode ser lido</p>";
    }
} else {
    echo "<p class='error'>❌ Arquivo .env não encontrado</p>";
    echo "<p>Crie um arquivo .env na raiz do projeto com as seguintes variáveis:</p>";
    echo "<pre>
VITE_API_BASE_URL=http://seu-dominio.com/api
VITE_ASAAS_API_URL=https://sandbox.asaas.com/api/v3
VITE_ASAAS_API_KEY=sua_api_key_do_asaas
VITE_WHATSAPP_API_URL=https://api.whatsapp.com
VITE_WHATSAPP_API_TOKEN=seu_token_whatsapp
</pre>";
}

echo "<h2>Resumo</h2>";
echo "<div class='summary'>";
echo "<p>Se todos os itens estão marcados com ✅, seu sistema está configurado corretamente.</p>";
echo "<p>Para itens marcados com ❌, siga as instruções no Manual de Instalação para resolver os problemas.</p>";
echo "</div>";

echo "<h2>Próximos Passos</h2>";
echo "<ol>";
echo "<li>Se todos os requisitos estiverem atendidos, remova este arquivo de verificação.</li>";
echo "<li>Verifique se a aplicação está funcionando corretamente em <a href='$app_url'>$app_url</a>.</li>";
echo "<li>Configure backups regulares do banco de dados.</li>";
echo "<li>Altere a senha do usuário admin após o primeiro login.</li>";
echo "</ol>";

echo "<p><a href='$app_url' class='button'>Ir para a aplicação</a></p>";
?>

<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
  }
  h1 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
  }
  h2 {
    color: #2980b9;
    margin-top: 25px;
    border-left: 5px solid #3498db;
    padding-left: 10px;
  }
  p, li {
    margin-bottom: 10px;
  }
  ul {
    padding-left: 20px;
  }
  .success {
    color: #27ae60;
  }
  .error {
    color: #e74c3c;
  }
  .notice {
    color: #f39c12;
  }
  pre {
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
  }
  .summary {
    background-color: #eaf2f8;
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
  }
  .button {
    display: inline-block;
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 20px;
  }
  .button:hover {
    background-color: #2980b9;
  }
</style>

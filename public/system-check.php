
<?php
// System check script for Track'n'Me
header('Content-Type: text/html; charset=UTF-8');

// Define required PHP extensions
$requiredExtensions = [
    'mysqli',
    'pdo',
    'pdo_mysql',
    'json',
    'mbstring',
    'xml',
    'curl'
];

// Get application URL
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$appUrl = $protocol . $_SERVER['HTTP_HOST'];

// Get application directory
$appDir = dirname(__DIR__);

// Function to check if mod_rewrite is enabled
function is_mod_rewrite_enabled() {
    if (function_exists('apache_get_modules')) {
        return in_array('mod_rewrite', apache_get_modules());
    }
    return false;
}

// HTML header
echo "<!DOCTYPE html>
<html lang='pt-BR'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Track'n'Me - Verificação do Sistema</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #5D3FD3;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        h2 {
            margin-top: 30px;
            color: #444;
        }
        .success {
            color: #27ae60;
        }
        .error {
            color: #e74c3c;
        }
        .item {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <h1>Track'n'Me - Verificação do Sistema</h1>
";

// PHP version
echo "<h2>Versão do PHP</h2>";
$phpVersion = phpversion();
echo "<p>Versão atual: $phpVersion</p>";
$requiredVersion = '8.0.0';
$versionCheck = version_compare($phpVersion, $requiredVersion, '>=');

echo "<p class='" . ($versionCheck ? 'success' : 'error') . "'>" . 
    ($versionCheck ? '✓' : '✗') . " Versão do PHP compatível</p>";

// PHP extensions
echo "<h2>Extensões PHP</h2>";
$allExtensionsInstalled = true;

foreach ($requiredExtensions as $ext) {
    $installed = extension_loaded($ext);
    echo "<div class='item'>" . 
        ($installed ? '✓' : '✗') . " $ext - " . 
        ($installed ? 'Instalada' : 'Não instalada') . "</div>";
    
    if (!$installed) {
        $allExtensionsInstalled = false;
    }
}

// Database connection
echo "<h2>Conexão com o Banco de Dados</h2>";
$dbConfigFile = __DIR__ . '/api/config/database.php';

if (file_exists($dbConfigFile)) {
    require_once $dbConfigFile;
    
    try {
        // Get database connection details from the Database class
        $database = new Database();
        $conn = $database->getConnection();
        
        if ($conn) {
            echo "<p class='success'>✓ Conexão com o banco de dados estabelecida</p>";
            $dbConnected = true;
            
            // Test with a simple query
            $stmt = $conn->query("SELECT 1 as test");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result && isset($result['test']) && $result['test'] == 1) {
                echo "<p class='success'>✓ Teste de consulta realizado com sucesso</p>";
            }
        } else {
            echo "<p class='error'>✗ Falha ao estabelecer conexão com o banco de dados</p>";
            $dbConnected = false;
        }
    } catch (Exception $e) {
        echo "<p class='error'>✗ " . $e->getMessage() . "</p>";
        $dbConnected = false;
    }
} else {
    echo "<p class='error'>✗ Arquivo de configuração do banco de dados não encontrado</p>";
    $dbConnected = false;
}

// Directory permissions
echo "<h2>Permissões de Diretórios</h2>";
$appDir = __DIR__;
$appDirPerms = substr(sprintf('%o', fileperms($appDir)), -4);
echo "<p>Diretório da aplicação: $appDir<br>Permissões: $appDirPerms</p>";

$appDirWritable = is_writable($appDir);
echo "<p class='" . ($appDirWritable ? 'success' : 'error') . "'>" . 
    ($appDirWritable ? '✓' : '✗') . " Diretório da aplicação é gravável</p>";

// Check if API directory exists
$apiDir = $appDir . '/api';
$apiDirExists = is_dir($apiDir);
echo "<p class='" . ($apiDirExists ? 'success' : 'error') . "'>" . 
    ($apiDirExists ? '✓' : '✗') . " Diretório API existe</p>";

// If API directory doesn't exist, create it
if (!$apiDirExists) {
    if (mkdir($apiDir, 0755, true)) {
        echo "<p class='success'>✓ Diretório API criado</p>";
        $apiDirExists = true;
    }
}

// Check if uploads directory exists
$uploadsDir = $appDir . '/uploads';
$uploadsDirExists = is_dir($uploadsDir);

if (!$uploadsDirExists) {
    if (mkdir($uploadsDir, 0755, true)) {
        echo "<p class='success'>✓ Diretório de uploads criado</p>";
    }
} else {
    echo "<p class='success'>✓ Diretório de uploads existe</p>";
}

// Server configuration
echo "<h2>Configuração do Servidor</h2>";
echo "<p>Servidor: " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p>Sistema Operacional: " . PHP_OS . "</p>";
echo "<p>Limite de Memória PHP: " . ini_get('memory_limit') . "</p>";
echo "<p>Tempo Máximo de Execução: " . ini_get('max_execution_time') . " segundos</p>";
echo "<p>Tamanho Máximo de Upload: " . ini_get('upload_max_filesize') . "</p>";
echo "<p>Tamanho Máximo de POST: " . ini_get('post_max_size') . "</p>";

// Check mod_rewrite
echo "<h2>Mod Rewrite</h2>";
$modRewriteEnabled = is_mod_rewrite_enabled();
echo "<p class='" . ($modRewriteEnabled ? 'success' : 'error') . "'>" . 
    ($modRewriteEnabled ? '✓' : '✗') . " mod_rewrite está " . 
    ($modRewriteEnabled ? 'ativado' : 'desativado') . "</p>";

// Application URL
echo "<h2>URL da Aplicação</h2>";
echo "<p>URL da aplicação: $appUrl</p>";

// Final summary and next steps
echo "<h2>Próximos Passos</h2>";
echo "<ol>";
echo "<li>Se todos os requisitos estiverem atendidos, remova este arquivo de verificação.</li>";
echo "<li>Verifique se a aplicação está funcionando corretamente em $appUrl.</li>";
echo "<li>Configure backups regulares do banco de dados.</li>";
echo "<li>Altere a senha do usuário admin após o primeiro login.</li>";
echo "</ol>";

echo "<p><a href='/' style='display: inline-block; padding: 10px 20px; background: #5D3FD3; color: white; text-decoration: none; border-radius: 4px;'>Ir para a aplicação</a></p>";

// Close HTML
echo "</body></html>";
?>

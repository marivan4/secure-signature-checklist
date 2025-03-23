
<?php
// Database connection test script
header('Content-Type: text/html; charset=utf-8');

// Database configuration
$hostname = "localhost";
$username = "checklist_user"; // Change to your database username
$password = "sua_senha_segura"; // Change to your database password
$database = "checklist_manager";

echo "<h1>Teste de Conexão com Banco de Dados</h1>";

// Test database connection
try {
    $conn = new PDO("mysql:host=$hostname;dbname=$database", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color:green'>Conexão com o banco de dados estabelecida com sucesso!</p>";
    
    // Check if tables exist
    $tables = ["users", "checklists"];
    echo "<h2>Verificando tabelas:</h2>";
    echo "<ul>";
    foreach ($tables as $table) {
        $stmt = $conn->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "<li style='color:green'>Tabela '$table' encontrada</li>";
            
            // Count records in table
            $count = $conn->query("SELECT COUNT(*) FROM $table")->fetchColumn();
            echo " - $count registros encontrados";
        } else {
            echo "<li style='color:red'>Tabela '$table' não encontrada</li>";
        }
    }
    echo "</ul>";
    
} catch(PDOException $e) {
    echo "<p style='color:red'>Erro de conexão: " . $e->getMessage() . "</p>";
}

// Server information
echo "<h2>Informações do Servidor:</h2>";
echo "<ul>";
echo "<li>Sistema Operacional: " . php_uname() . "</li>";
echo "<li>Versão PHP: " . phpversion() . "</li>";
echo "<li>Servidor Web: " . $_SERVER['SERVER_SOFTWARE'] . "</li>";
echo "<li>Diretório da Aplicação: " . getcwd() . "</li>";
echo "</ul>";

// Test file permissions
echo "<h2>Verificação de Permissões:</h2>";
$app_dir = getcwd();
echo "<p>Permissões do diretório raiz: " . substr(sprintf('%o', fileperms($app_dir)), -4) . "</p>";

// Check for required PHP extensions
echo "<h2>Extensões PHP:</h2>";
$required_extensions = ['pdo', 'pdo_mysql', 'json', 'mbstring', 'xml'];
echo "<ul>";
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<li style='color:green'>$ext - Instalado</li>";
    } else {
        echo "<li style='color:red'>$ext - Não instalado</li>";
    }
}
echo "</ul>";

echo "<h2>Próximos Passos:</h2>";
echo "<ol>";
echo "<li>Se a conexão com o banco falhar, verifique as credenciais e se o serviço MySQL está rodando</li>";
echo "<li>Se as tabelas não forem encontradas, execute o script SQL para criá-las</li>";
echo "<li>Para o aplicativo React, certifique-se de que sua configuração do Apache está correta</li>";
echo "</ol>";
?>

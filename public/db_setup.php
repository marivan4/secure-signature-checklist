
<?php
// Database setup for Track'n'Me System
header('Content-Type: text/html; charset=utf-8');

// Configuration
$host = "localhost";
$username = "checklist_user";
$password = "sua_senha_segura";
$dbname = "checklist_manager";

// Create connection
$conn = new mysqli($host, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("<div style='color:red; font-weight:bold;'>Falha na conexão: " . $conn->connect_error . "</div>");
}

echo "<h1>Configuração do banco de dados - Track'n'Me</h1>";

// Create database if not exists
$sql = "CREATE DATABASE IF NOT EXISTS $dbname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if ($conn->query($sql) === TRUE) {
    echo "<p>✅ Banco de dados '$dbname' criado ou já existente.</p>";
} else {
    echo "<p style='color:red'>❌ Erro ao criar banco de dados: " . $conn->error . "</p>";
    exit;
}

// Select database
$conn->select_db($dbname);

// Import SQL structure from file
$sql_file = file_get_contents("../db/structure.sql");

if ($sql_file === false) {
    echo "<p style='color:red'>❌ Erro ao ler arquivo SQL. Verifique se o arquivo db/structure.sql existe.</p>";
    exit;
}

// Split SQL file into separate queries
$queries = explode(';', $sql_file);
$success = true;

foreach ($queries as $query) {
    $query = trim($query);
    if (empty($query)) continue;
    
    if ($conn->query($query) !== TRUE) {
        echo "<p style='color:red'>❌ Erro na consulta: " . $conn->error . "</p>";
        echo "<p>Consulta que falhou: " . htmlspecialchars($query) . "</p>";
        $success = false;
        break;
    }
}

if ($success) {
    echo "<h2>✅ Configuração do banco de dados concluída com sucesso!</h2>";
    // Create test users
    createTestUsers($conn);
    echo "<p>O banco de dados foi configurado e populado com dados de teste.</p>";
    echo "<div style='margin-top: 20px; padding: 10px; background-color: #ffffcc; border: 1px solid #ffcc00;'>";
    echo "<h3>⚠️ Próximos passos:</h3>";
    echo "<ol>";
    echo "<li>Por segurança, <strong>remova este arquivo</strong> (db_setup.php) após a configuração.</li>";
    echo "<li>Verifique a configuração do sistema em <a href='/system-check.php'>system-check.php</a>.</li>";
    echo "<li>Acesse o sistema com o usuário <strong>admin</strong> e senha <strong>admin</strong>.</li>";
    echo "<li>Altere a senha do administrador imediatamente após o primeiro login.</li>";
    echo "</ol>";
    echo "</div>";
} else {
    echo "<h2 style='color:red'>❌ Ocorreram erros durante a configuração do banco de dados.</h2>";
    echo "<p>Revise os erros acima e tente novamente.</p>";
}

function createTestUsers($conn) {
    // Create test users if they don't exist yet
    $users = [
        ['username' => 'client', 'password' => 'client', 'role' => 'client'],
        ['username' => 'manager', 'password' => 'manager', 'role' => 'manager'],
        ['username' => 'reseller', 'password' => 'reseller', 'role' => 'reseller'],
        ['username' => 'endclient', 'password' => 'endclient', 'role' => 'end_client']
    ];
    
    $count = 0;
    foreach ($users as $user) {
        $username = $user['username'];
        $password = password_hash($user['password'], PASSWORD_DEFAULT);
        $role = $user['role'];
        
        $check = $conn->query("SELECT id FROM usuarios WHERE username = '$username'");
        if ($check->num_rows == 0) {
            $sql = "INSERT INTO usuarios (username, password, role) VALUES ('$username', '$password', '$role')";
            if ($conn->query($sql) === TRUE) {
                $count++;
            }
        }
    }
    
    if ($count > 0) {
        echo "<p>✅ Criados $count usuários de teste.</p>";
    } else {
        echo "<p>ℹ️ Usuários de teste já existem.</p>";
    }
}

$conn->close();
?>

<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    max-width: 800px;
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
  }
  p {
    margin-bottom: 16px;
  }
  a {
    color: #3498db;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>

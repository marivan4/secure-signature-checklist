
<?php
// This script should be run once to set up the MySQL user and database
// WARNING: Running this multiple times will reset existing data

header('Content-Type: text/html; charset=UTF-8');
echo "<h1>Track'n'Me Database Setup</h1>";

// MySQL root credentials (only used for initial setup)
$root_user = 'root';
$root_password = ''; // Enter your MySQL root password here
$host = 'localhost';

// Define a stronger password that meets policy requirements
$secure_password = 'Track2025!#Secure@Pwd';

try {
    // Connect as root
    $conn = new PDO("mysql:host=$host", $root_user, $root_password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $conn->exec("CREATE DATABASE IF NOT EXISTS checklist_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "<p>✅ Database 'checklist_manager' created or already exists.</p>";
    
    // Check if user exists and create if it doesn't
    $stmt = $conn->query("SELECT User FROM mysql.user WHERE User = 'checklist_user'");
    if ($stmt->rowCount() == 0) {
        // Create user with stronger password
        $conn->exec("CREATE USER 'checklist_user'@'localhost' IDENTIFIED BY '$secure_password'");
        echo "<p>✅ User 'checklist_user' created.</p>";
    } else {
        // Update existing user with stronger password
        $conn->exec("ALTER USER 'checklist_user'@'localhost' IDENTIFIED BY '$secure_password'");
        echo "<p>ℹ️ User 'checklist_user' already exists. Password updated.</p>";
    }
    
    // Grant privileges
    $conn->exec("GRANT ALL PRIVILEGES ON checklist_manager.* TO 'checklist_user'@'localhost'");
    $conn->exec("FLUSH PRIVILEGES");
    echo "<p>✅ Database privileges granted to 'checklist_user'.</p>";
    
    // Test connection as new user
    $test_conn = new PDO("mysql:host=$host;dbname=checklist_manager", "checklist_user", $secure_password);
    echo "<p>✅ Connection as 'checklist_user' successful!</p>";
    
    echo "<p>You can now <a href='../system-check.php'>run the system check again</a>.</p>";
    
} catch(PDOException $e) {
    echo "<p>❌ Database setup error: " . $e->getMessage() . "</p>";
}
?>

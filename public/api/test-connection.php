
<?php
// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Include database config
require_once __DIR__ . '/config/database.php';

// Response array
$response = [
    'success' => false,
    'message' => '',
    'server_info' => [
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'datetime' => date('Y-m-d H:i:s'),
        'timezone' => date_default_timezone_get()
    ]
];

try {
    // Create database instance
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        // Test with a simple query
        $stmt = $conn->query("SELECT 1 as test");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result && isset($result['test']) && $result['test'] == 1) {
            $response['success'] = true;
            $response['message'] = 'Database connection successful';
            
            // Get server info
            $response['database_info'] = [
                'server_info' => $conn->getAttribute(PDO::ATTR_SERVER_INFO) ?? 'Unavailable',
                'server_version' => $conn->getAttribute(PDO::ATTR_SERVER_VERSION),
                'client_version' => $conn->getAttribute(PDO::ATTR_CLIENT_VERSION),
                'connection_status' => $conn->getAttribute(PDO::ATTR_CONNECTION_STATUS),
                'driver_name' => $conn->getAttribute(PDO::ATTR_DRIVER_NAME)
            ];
            
            // Check if tables exist
            $tables = ["usuarios", "veiculos", "invoices", "checklists"];
            $tablesInfo = [];
            
            foreach ($tables as $table) {
                $tableExists = $database->tableExists($table);
                $count = 0;
                
                if ($tableExists) {
                    $countStmt = $conn->query("SELECT COUNT(*) as count FROM {$table}");
                    $countResult = $countStmt->fetch(PDO::FETCH_ASSOC);
                    $count = $countResult['count'];
                }
                
                $tablesInfo[$table] = [
                    'exists' => $tableExists,
                    'records' => $count
                ];
            }
            
            $response['tables'] = $tablesInfo;
        } else {
            $response['message'] = 'Database connected but test query failed';
        }
    } else {
        $response['message'] = 'Failed to establish database connection';
    }
} catch (PDOException $e) {
    $response['message'] = 'Database connection error: ' . $e->getMessage();
    $response['error_details'] = $e->getTrace()[0] ?? [];
}

// Output response
echo json_encode($response, JSON_PRETTY_PRINT);
?>


<?php
// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if request is OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Response array
$response = [
    'success' => false,
    'message' => '',
    'data' => null,
    'query' => '',
    'execution_time' => 0
];

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Only POST requests are allowed';
    echo json_encode($response);
    exit;
}

// Get JSON data from request
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate input
if (!$data || !isset($data['query']) || empty($data['query'])) {
    $response['message'] = 'Invalid request. Query parameter is required';
    echo json_encode($response);
    exit;
}

// Extract the query
$query = trim($data['query']);
$response['query'] = $query;

// Security check - only allow SELECT queries for safety
if (!preg_match('/^SELECT\s/i', $query)) {
    $response['message'] = 'For security reasons, only SELECT queries are allowed';
    echo json_encode($response);
    exit;
}

// Include database config
require_once __DIR__ . '/config/database.php';

try {
    // Create database instance
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        // Measure execution time
        $startTime = microtime(true);
        
        // Execute the query
        $stmt = $conn->query($query);
        
        if ($stmt) {
            // Fetch all results
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $endTime = microtime(true);
            
            $response['success'] = true;
            $response['message'] = 'Query executed successfully';
            $response['data'] = $results;
            $response['row_count'] = count($results);
            $response['execution_time'] = round($endTime - $startTime, 4);
        } else {
            $response['message'] = 'Query failed to execute';
        }
    } else {
        $response['message'] = 'Failed to establish database connection';
    }
} catch (PDOException $e) {
    $response['message'] = 'Database error: ' . $e->getMessage();
    $response['error_details'] = [
        'code' => $e->getCode(),
        'line' => $e->getLine()
    ];
}

// Output response
echo json_encode($response, JSON_PRETTY_PRINT);
?>

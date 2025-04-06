
<?php
// API status endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

echo json_encode([
    'status' => 'online',
    'message' => 'Track\'n\'Me API is running',
    'version' => '1.0.0',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>

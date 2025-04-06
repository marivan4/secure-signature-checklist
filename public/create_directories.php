
<?php
header('Content-Type: text/html; charset=UTF-8');
echo "<h1>Track'n'Me Directory Structure Setup</h1>";

// Define directories to create
$directories = [
    'api',
    'api/config',
    'api/checklists',
    'api/clients',
    'api/invoices',
    'api/trackers',
    'api/users',
    'api/vehicles',
    'uploads',
    'uploads/logos',
    'uploads/signatures',
    'uploads/documents'
];

// Create directories and set permissions
$base_path = __DIR__;
$success_count = 0;
$total = count($directories);

foreach($directories as $dir) {
    $full_path = $base_path . '/' . $dir;
    
    if (!file_exists($full_path)) {
        if (mkdir($full_path, 0755, true)) {
            echo "<p>✅ Created directory: {$dir}</p>";
            $success_count++;
        } else {
            echo "<p>❌ Failed to create directory: {$dir}</p>";
        }
    } else {
        echo "<p>ℹ️ Directory already exists: {$dir}</p>";
        $success_count++;
    }
}

echo "<h2>Summary</h2>";
echo "<p>{$success_count} out of {$total} directories are ready.</p>";
echo "<p>You can now <a href='system-check.php'>run the system check again</a>.</p>";
?>

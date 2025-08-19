<?php
echo "<h1>PHP is Working!</h1>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Current Time: " . date('Y-m-d H:i:s') . "</p>";
echo "<p>Server: " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p>Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";

// Test if we can access Laravel files
$laravelPath = dirname(__DIR__);
echo "<p>Laravel Path: " . $laravelPath . "</p>";
echo "<p>Laravel exists: " . (file_exists($laravelPath . '/artisan') ? 'Yes' : 'No') . "</p>";

// Test database connection
try {
    $pdo = new PDO('mysql:host=advocate.juvisa.org;dbname=idap', 'idap', 'Advocates@3996');
    echo "<p style='color: green;'>Database connection: SUCCESS</p>";
} catch (PDOException $e) {
    echo "<p style='color: red;'>Database connection: FAILED - " . $e->getMessage() . "</p>";
}
?>

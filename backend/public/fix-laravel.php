<?php
echo "<h1>Fixing Laravel File Arrangement</h1>";

$laravelRoot = dirname(__DIR__);

// Create required directories
$directories = [
    $laravelRoot . '/storage/framework/cache',
    $laravelRoot . '/storage/framework/sessions',
    $laravelRoot . '/storage/framework/views',
    $laravelRoot . '/storage/logs',
    $laravelRoot . '/bootstrap/cache'
];

foreach ($directories as $dir) {
    if (!file_exists($dir)) {
        if (mkdir($dir, 0755, true)) {
            echo "<p style='color: green;'>✅ Created: " . basename($dir) . "</p>";
        } else {
            echo "<p style='color: red;'>❌ Failed to create: " . basename($dir) . "</p>";
        }
    } else {
        echo "<p style='color: blue;'>ℹ️ Exists: " . basename($dir) . "</p>";
    }
}

// Set permissions
$permissionDirs = [
    $laravelRoot . '/storage',
    $laravelRoot . '/bootstrap/cache'
];

foreach ($permissionDirs as $dir) {
    if (file_exists($dir)) {
        if (chmod($dir, 0755)) {
            echo "<p style='color: green;'>✅ Set permissions: " . basename($dir) . "</p>";
        } else {
            echo "<p style='color: red;'>❌ Failed to set permissions: " . basename($dir) . "</p>";
        }
    }
}

// Test Laravel bootstrap
echo "<h2>Testing Laravel Bootstrap</h2>";

try {
    // Test autoloader
    require_once $laravelRoot . '/vendor/autoload.php';
    echo "<p style='color: green;'>✅ Autoloader loaded</p>";
    
    // Test bootstrap
    $app = require_once $laravelRoot . '/bootstrap/app.php';
    echo "<p style='color: green;'>✅ Laravel app bootstrapped</p>";
    
    echo "<p style='color: green; font-weight: bold;'>🎉 Laravel is now working!</p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Laravel bootstrap failed: " . $e->getMessage() . "</p>";
}
?>

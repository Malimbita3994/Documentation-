<?php
echo "<h1>Laravel Autoloader Test</h1>";

// Test 1: Check if vendor/autoload.php exists
$autoloadPath = __DIR__ . '/../vendor/autoload.php';
echo "<p>Autoload path: " . $autoloadPath . "</p>";
echo "<p>Autoload exists: " . (file_exists($autoloadPath) ? 'Yes' : 'No') . "</p>";

// Test 2: Try to include autoloader
try {
    require_once $autoloadPath;
    echo "<p style='color: green;'>✅ Autoloader loaded successfully</p>";
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Autoloader failed: " . $e->getMessage() . "</p>";
}

// Test 3: Check if Laravel classes are available
try {
    if (class_exists('Illuminate\Foundation\Application')) {
        echo "<p style='color: green;'>✅ Laravel Application class found</p>";
    } else {
        echo "<p style='color: red;'>❌ Laravel Application class not found</p>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error checking Laravel classes: " . $e->getMessage() . "</p>";
}

// Test 4: Check bootstrap/app.php
$bootstrapPath = __DIR__ . '/../bootstrap/app.php';
echo "<p>Bootstrap path: " . $bootstrapPath . "</p>";
echo "<p>Bootstrap exists: " . (file_exists($bootstrapPath) ? 'Yes' : 'No') . "</p>";

// Test 5: Check storage permissions
$storagePath = __DIR__ . '/../storage';
echo "<p>Storage path: " . $storagePath . "</p>";
echo "<p>Storage exists: " . (file_exists($storagePath) ? 'Yes' : 'No') . "</p>";
echo "<p>Storage writable: " . (is_writable($storagePath) ? 'Yes' : 'No') . "</p>";

// Test 6: Check bootstrap/cache permissions
$cachePath = __DIR__ . '/../bootstrap/cache';
echo "<p>Cache path: " . $cachePath . "</p>";
echo "<p>Cache exists: " . (file_exists($cachePath) ? 'Yes' : 'No') . "</p>";
echo "<p>Cache writable: " . (is_writable($cachePath) ? 'Yes' : 'No') . "</p>";
?>

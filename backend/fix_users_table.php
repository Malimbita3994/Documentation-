<?php

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "Adding missing fields to users table...\n";
    
    // Check if fields already exist
    $columns = Capsule::select("SHOW COLUMNS FROM users LIKE 'username'");
    if (empty($columns)) {
        Capsule::statement("ALTER TABLE users ADD COLUMN username VARCHAR(255) UNIQUE NULL AFTER name");
        echo "Added username field\n";
    } else {
        echo "username field already exists\n";
    }
    
    $columns = Capsule::select("SHOW COLUMNS FROM users LIKE 'phone'");
    if (empty($columns)) {
        Capsule::statement("ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL AFTER email");
        echo "Added phone field\n";
    } else {
        echo "phone field already exists\n";
    }
    
    $columns = Capsule::select("SHOW COLUMNS FROM users LIKE 'avatar'");
    if (empty($columns)) {
        Capsule::statement("ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL AFTER phone");
        echo "Added avatar field\n";
    } else {
        echo "avatar field already exists\n";
    }
    
    $columns = Capsule::select("SHOW COLUMNS FROM users LIKE 'status'");
    if (empty($columns)) {
        Capsule::statement("ALTER TABLE users ADD COLUMN status ENUM('active', 'inactive', 'suspended') DEFAULT 'active' AFTER avatar");
        echo "Added status field\n";
    } else {
        echo "status field already exists\n";
    }
    
    $columns = Capsule::select("SHOW COLUMNS FROM users LIKE 'last_login_at'");
    if (empty($columns)) {
        Capsule::statement("ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL AFTER status");
        echo "Added last_login_at field\n";
    } else {
        echo "last_login_at field already exists\n";
    }
    
    $columns = Capsule::select("SHOW COLUMNS FROM users LIKE 'last_login_ip'");
    if (empty($columns)) {
        Capsule::statement("ALTER TABLE users ADD COLUMN last_login_ip VARCHAR(45) NULL AFTER last_login_at");
        echo "Added last_login_ip field\n";
    } else {
        echo "last_login_ip field already exists\n";
    }
    
    $columns = Capsule::select("SHOW COLUMNS FROM users LIKE 'bio'");
    if (empty($columns)) {
        Capsule::statement("ALTER TABLE users ADD COLUMN bio TEXT NULL AFTER last_login_ip");
        echo "Added bio field\n";
    } else {
        echo "bio field already exists\n";
    }
    
    $columns = Capsule::select("SHOW COLUMNS FROM users LIKE 'preferences'");
    if (empty($columns)) {
        Capsule::statement("ALTER TABLE users ADD COLUMN preferences JSON NULL AFTER bio");
        echo "Added preferences field\n";
    } else {
        echo "preferences field already exists\n";
    }
    
    echo "Users table updated successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}




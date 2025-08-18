<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "Checking users in database...\n";
    
    // Get all users
    $users = \App\Models\User::all();
    
    echo "Found " . $users->count() . " users:\n";
    
    foreach ($users as $user) {
        echo "\nUser ID: " . $user->id;
        echo "\nName: " . $user->name;
        echo "\nEmail: " . $user->email;
        echo "\nUsername: " . ($user->username ?? 'NULL');
        echo "\nStatus: " . ($user->status ?? 'NULL');
        echo "\nBio: " . ($user->bio ?? 'NULL');
        echo "\nAvatar: " . ($user->avatar ?? 'NULL');
        echo "\nCreated: " . $user->created_at;
        echo "\nUpdated: " . $user->updated_at;
        echo "\n" . str_repeat('-', 50) . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}




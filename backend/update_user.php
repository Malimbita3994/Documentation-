<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "Updating existing user...\n";
    
    // Get the existing user
    $user = \App\Models\User::first();
    
    if ($user) {
        echo "Found user: " . $user->name . "\n";
        
        // Update the user with missing fields
        $user->update([
            'username' => 'admin',
            'status' => 'active',
            'bio' => 'System administrator with full access to all features',
            'preferences' => json_encode([
                'theme' => 'light',
                'notifications' => [
                    'email' => true,
                    'push' => true,
                    'sms' => false,
                ],
                'language' => 'en',
                'timezone' => 'UTC',
            ])
        ]);
        
        echo "User updated successfully!\n";
        echo "Username: " . $user->username . "\n";
        echo "Status: " . $user->status . "\n";
        echo "Bio: " . $user->bio . "\n";
        
    } else {
        echo "No users found in database\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}




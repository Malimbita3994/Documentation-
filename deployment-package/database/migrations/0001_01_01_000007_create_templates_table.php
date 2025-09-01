<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['SRS', 'SDD', 'Concept Note', 'Test Cases', 'User Manual', 'Feasibility Study', 'Project Charter', 'Custom']);
            $table->text('description');
            $table->json('structure');
            $table->boolean('is_default')->default(false);
            $table->boolean('is_custom')->default(false);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->unsignedInteger('usage_count')->default(0);
            $table->timestamps();
            
            $table->index(['type', 'is_default']);
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};










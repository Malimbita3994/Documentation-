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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['SRS', 'SDD', 'Concept Note', 'Test Cases', 'User Manual', 'Feasibility Study', 'Project Charter', 'Custom']);
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['Draft', 'In Review', 'Approved', 'Published', 'Archived'])->default('Draft');
            $table->string('version')->default('1.0');
            $table->json('content')->nullable();
            $table->json('metadata')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('last_modified_by')->constrained('users')->onDelete('cascade');
            $table->json('tags')->nullable();
            $table->timestamps();
            
            $table->index(['project_id', 'type']);
            $table->index(['status', 'created_at']);
            $table->index('created_by');
            $table->index('last_modified_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};








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
        Schema::create('requirements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('type', ['Functional', 'Non-Functional', 'Business', 'User', 'System']);
            $table->enum('priority', ['Critical', 'High', 'Medium', 'Low'])->default('Medium');
            $table->enum('status', ['Proposed', 'Approved', 'In Development', 'Implemented', 'Tested', 'Deployed'])->default('Proposed');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('document_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('parent_id')->nullable()->constrained('requirements')->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->json('tags')->nullable();
            $table->json('acceptance_criteria')->nullable();
            $table->json('dependencies')->nullable();
            $table->timestamps();
            
            $table->index(['project_id', 'type']);
            $table->index(['status', 'priority']);
            $table->index('assigned_to');
            $table->index('parent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requirements');
    }
};
















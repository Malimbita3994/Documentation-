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
        Schema::table('templates', function (Blueprint $table) {
            // Add new columns for file management
            if (!Schema::hasColumn('templates', 'file_path')) {
                $table->string('file_path')->after('description');
            }
            if (!Schema::hasColumn('templates', 'file_name')) {
                $table->string('file_name')->after('file_path');
            }
            if (!Schema::hasColumn('templates', 'file_size')) {
                $table->bigInteger('file_size')->after('file_name');
            }
            if (!Schema::hasColumn('templates', 'file_type')) {
                $table->string('file_type')->after('file_size');
            }
            if (!Schema::hasColumn('templates', 'content_type')) {
                $table->string('content_type')->after('file_type');
            }
            if (!Schema::hasColumn('templates', 'industry')) {
                $table->string('industry')->default('general')->after('content_type');
            }
            if (!Schema::hasColumn('templates', 'standards')) {
                $table->json('standards')->nullable()->after('industry');
            }
            if (!Schema::hasColumn('templates', 'tags')) {
                $table->json('tags')->nullable()->after('standards');
            }
            if (!Schema::hasColumn('templates', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('tags');
            }
            if (!Schema::hasColumn('templates', 'uploaded_by')) {
                $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade')->after('is_active');
            }
            if (!Schema::hasColumn('templates', 'download_count')) {
                $table->integer('download_count')->default(0)->after('uploaded_by');
            }
            if (!Schema::hasColumn('templates', 'version')) {
                $table->string('version')->default('1.0.0')->after('download_count');
            }

            // Add category column if it doesn't exist
            if (!Schema::hasColumn('templates', 'category')) {
                $table->string('category')->default('General')->after('name');
            }

            // Add indexes for better performance
            $table->index(['content_type', 'industry']);
            $table->index(['category', 'is_active']);
            $table->index('tags');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            // Remove indexes
            $table->dropIndex(['content_type', 'industry']);
            $table->dropIndex(['category', 'is_active']);
            $table->dropIndex(['tags']);

            // Remove columns
            $table->dropColumn([
                'file_path',
                'file_name', 
                'file_size',
                'file_type',
                'content_type',
                'industry',
                'standards',
                'tags',
                'is_active',
                'uploaded_by',
                'download_count',
                'version',
                'category'
            ]);
        });
    }
};

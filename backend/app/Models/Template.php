<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'file_path',
        'file_name',
        'file_size',
        'file_type',
        'content_type', // SRS, SDD, Test Cases, User Manual, Progress Report
        'industry',
        'standards',
        'tags',
        'is_active',
        'uploaded_by',
        'download_count',
        'version'
    ];

    protected $casts = [
        'standards' => 'array',
        'tags' => 'array',
        'is_active' => 'boolean',
        'download_count' => 'integer',
        'version' => 'string'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getFileSizeFormattedAttribute()
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getFileTypeIconAttribute()
    {
        switch (strtolower($this->file_type)) {
            case 'docx':
                return '📄';
            case 'doc':
                return '📄';
            case 'pdf':
                return '📕';
            case 'txt':
                return '📝';
            case 'md':
                return '📝';
            default:
                return '📁';
        }
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByContentType($query, $contentType)
    {
        return $query->where('content_type', $contentType);
    }

    public function scopeByIndustry($query, $industry)
    {
        return $query->where('industry', $industry);
    }

    public function incrementDownloadCount()
    {
        $this->increment('download_count');
    }
}










<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'project_id',
        'status',
        'version',
        'content',
        'metadata',
        'created_by',
        'last_modified_by',
        'tags',
    ];

    protected $casts = [
        'content' => 'array',
        'metadata' => 'array',
        'tags' => 'array',
    ];

    public const TYPE_SRS = 'SRS';
    public const TYPE_SDD = 'SDD';
    public const TYPE_CONCEPT_NOTE = 'Concept Note';
    public const TYPE_TEST_CASES = 'Test Cases';
    public const TYPE_USER_MANUAL = 'User Manual';
    public const TYPE_FEASIBILITY_STUDY = 'Feasibility Study';
    public const TYPE_PROJECT_CHARTER = 'Project Charter';
    public const TYPE_CUSTOM = 'Custom';

    public const STATUS_DRAFT = 'Draft';
    public const STATUS_IN_REVIEW = 'In Review';
    public const STATUS_APPROVED = 'Approved';
    public const STATUS_PUBLISHED = 'Published';
    public const STATUS_ARCHIVED = 'Archived';

    public static function getTypes(): array
    {
        return [
            self::TYPE_SRS,
            self::TYPE_SDD,
            self::TYPE_CONCEPT_NOTE,
            self::TYPE_TEST_CASES,
            self::TYPE_USER_MANUAL,
            self::TYPE_FEASIBILITY_STUDY,
            self::TYPE_PROJECT_CHARTER,
            self::TYPE_CUSTOM,
        ];
    }

    public static function getStatuses(): array
    {
        return [
            self::STATUS_DRAFT,
            self::STATUS_IN_REVIEW,
            self::STATUS_APPROVED,
            self::STATUS_PUBLISHED,
            self::STATUS_ARCHIVED,
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function lastModifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_modified_by');
    }

    public function requirements(): BelongsToMany
    {
        return $this->belongsToMany(Requirement::class, 'document_requirements');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(DocumentSection::class);
    }

    public function diagrams(): HasMany
    {
        return $this->hasMany(Diagram::class);
    }

    public function tables(): HasMany
    {
        return $this->hasMany(Table::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isInReview(): bool
    {
        return $this->status === self::STATUS_IN_REVIEW;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    public function canBeEdited(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_IN_REVIEW]);
    }

    public function incrementVersion(): void
    {
        $versionParts = explode('.', $this->version);
        $minor = (int) end($versionParts);
        $versionParts[count($versionParts) - 1] = $minor + 1;
        $this->version = implode('.', $versionParts);
    }
}










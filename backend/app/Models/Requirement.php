<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Requirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'priority',
        'status',
        'project_id',
        'document_id',
        'parent_id',
        'assigned_to',
        'tags',
        'acceptance_criteria',
        'dependencies',
    ];

    protected $casts = [
        'tags' => 'array',
        'acceptance_criteria' => 'array',
        'dependencies' => 'array',
    ];

    public const TYPE_FUNCTIONAL = 'Functional';
    public const TYPE_NON_FUNCTIONAL = 'Non-Functional';
    public const TYPE_BUSINESS = 'Business';
    public const TYPE_USER = 'User';
    public const TYPE_SYSTEM = 'System';

    public const PRIORITY_CRITICAL = 'Critical';
    public const PRIORITY_HIGH = 'High';
    public const PRIORITY_MEDIUM = 'Medium';
    public const PRIORITY_LOW = 'Low';

    public const STATUS_PROPOSED = 'Proposed';
    public const STATUS_APPROVED = 'Approved';
    public const STATUS_IN_DEVELOPMENT = 'In Development';
    public const STATUS_IMPLEMENTED = 'Implemented';
    public const STATUS_TESTED = 'Tested';
    public const STATUS_DEPLOYED = 'Deployed';

    public static function getTypes(): array
    {
        return [
            self::TYPE_FUNCTIONAL,
            self::TYPE_NON_FUNCTIONAL,
            self::TYPE_BUSINESS,
            self::TYPE_USER,
            self::TYPE_SYSTEM,
        ];
    }

    public static function getPriorities(): array
    {
        return [
            self::PRIORITY_CRITICAL,
            self::PRIORITY_HIGH,
            self::PRIORITY_MEDIUM,
            self::PRIORITY_LOW,
        ];
    }

    public static function getStatuses(): array
    {
        return [
            self::STATUS_PROPOSED,
            self::STATUS_APPROVED,
            self::STATUS_IN_DEVELOPMENT,
            self::STATUS_IMPLEMENTED,
            self::STATUS_TESTED,
            self::STATUS_DEPLOYED,
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Requirement::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Requirement::class, 'parent_id');
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'document_requirements');
    }

    public function isCritical(): bool
    {
        return $this->priority === self::PRIORITY_CRITICAL;
    }

    public function isHighPriority(): bool
    {
        return in_array($this->priority, [self::PRIORITY_CRITICAL, self::PRIORITY_HIGH]);
    }

    public function isFunctional(): bool
    {
        return $this->type === self::TYPE_FUNCTIONAL;
    }

    public function isNonFunctional(): bool
    {
        return $this->type === self::TYPE_NON_FUNCTIONAL;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_DEPLOYED;
    }

    public function isInProgress(): bool
    {
        return in_array($this->status, [
            self::STATUS_APPROVED,
            self::STATUS_IN_DEVELOPMENT,
            self::STATUS_IMPLEMENTED,
            self::STATUS_TESTED,
        ]);
    }

    public function hasChildren(): bool
    {
        return $this->children()->exists();
    }

    public function isChild(): bool
    {
        return !is_null($this->parent_id);
    }
}
















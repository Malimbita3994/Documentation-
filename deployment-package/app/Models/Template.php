<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'description',
        'structure',
        'is_default',
        'is_custom',
        'created_by',
        'usage_count',
    ];

    protected $casts = [
        'structure' => 'array',
        'is_default' => 'boolean',
        'is_custom' => 'boolean',
    ];

    public const TYPE_SRS = 'SRS';
    public const TYPE_SDD = 'SDD';
    public const TYPE_CONCEPT_NOTE = 'Concept Note';
    public const TYPE_TEST_CASES = 'Test Cases';
    public const TYPE_USER_MANUAL = 'User Manual';
    public const TYPE_FEASIBILITY_STUDY = 'Feasibility Study';
    public const TYPE_PROJECT_CHARTER = 'Project Charter';
    public const TYPE_CUSTOM = 'Custom';

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

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(TemplateSection::class);
    }

    public function isDefault(): bool
    {
        return $this->is_default;
    }

    public function isCustom(): bool
    {
        return $this->is_custom;
    }

    public function incrementUsageCount(): void
    {
        $this->increment('usage_count');
    }

    public function getStructureSections(): array
    {
        return $this->structure['sections'] ?? [];
    }

    public function getRequiredFields(): array
    {
        return $this->structure['required_fields'] ?? [];
    }

    public function getOptionalFields(): array
    {
        return $this->structure['optional_fields'] ?? [];
    }

    public function getValidationRules(): array
    {
        return $this->structure['validation_rules'] ?? [];
    }

    public function hasSection(string $sectionTitle): bool
    {
        $sections = $this->getStructureSections();
        return collect($sections)->contains('title', $sectionTitle);
    }

    public function getSectionContent(string $sectionTitle): ?string
    {
        $sections = $this->getStructureSections();
        $section = collect($sections)->firstWhere('title', $sectionTitle);
        return $section['content_template'] ?? null;
    }
}










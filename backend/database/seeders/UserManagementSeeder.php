<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Hash;

class UserManagementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // ===== USER MANAGEMENT =====
            ['name' => 'view_users', 'display_name' => 'View Users', 'module' => 'users', 'description' => 'Can view user list and details'],
            ['name' => 'create_users', 'display_name' => 'Create Users', 'module' => 'users', 'description' => 'Can create new users'],
            ['name' => 'edit_users', 'display_name' => 'Edit Users', 'module' => 'users', 'description' => 'Can edit existing users'],
            ['name' => 'delete_users', 'display_name' => 'Delete Users', 'module' => 'users', 'description' => 'Can delete users'],
            ['name' => 'bulk_edit_users', 'display_name' => 'Bulk Edit Users', 'module' => 'users', 'description' => 'Can edit multiple users at once'],
            ['name' => 'bulk_delete_users', 'display_name' => 'Bulk Delete Users', 'module' => 'users', 'description' => 'Can delete multiple users at once'],
            ['name' => 'export_users', 'display_name' => 'Export Users', 'module' => 'users', 'description' => 'Can export user data'],
            ['name' => 'import_users', 'display_name' => 'Import Users', 'module' => 'users', 'description' => 'Can import user data'],
            ['name' => 'view_user_profile', 'display_name' => 'View User Profile', 'module' => 'users', 'description' => 'Can view detailed user profile'],
            ['name' => 'edit_user_profile', 'display_name' => 'Edit User Profile', 'module' => 'users', 'description' => 'Can edit user profile information'],
            ['name' => 'change_user_password', 'display_name' => 'Change User Password', 'module' => 'users', 'description' => 'Can change user passwords'],
            ['name' => 'activate_users', 'display_name' => 'Activate Users', 'module' => 'users', 'description' => 'Can activate user accounts'],
            ['name' => 'deactivate_users', 'display_name' => 'Deactivate Users', 'module' => 'users', 'description' => 'Can deactivate user accounts'],
            ['name' => 'assign_user_roles', 'display_name' => 'Assign User Roles', 'module' => 'users', 'description' => 'Can assign roles to users'],
            ['name' => 'view_user_activity', 'display_name' => 'View User Activity', 'module' => 'users', 'description' => 'Can view user activity logs'],
            
            // ===== ROLE MANAGEMENT =====
            ['name' => 'view_roles', 'display_name' => 'View Roles', 'module' => 'roles', 'description' => 'Can view role list and details'],
            ['name' => 'create_roles', 'display_name' => 'Create Roles', 'module' => 'roles', 'description' => 'Can create new roles'],
            ['name' => 'edit_roles', 'display_name' => 'Edit Roles', 'module' => 'roles', 'description' => 'Can edit existing roles'],
            ['name' => 'delete_roles', 'display_name' => 'Delete Roles', 'module' => 'roles', 'description' => 'Can delete roles'],
            ['name' => 'assign_role_permissions', 'display_name' => 'Assign Role Permissions', 'module' => 'roles', 'description' => 'Can assign permissions to roles'],
            ['name' => 'view_role_users', 'display_name' => 'View Role Users', 'module' => 'roles', 'description' => 'Can view users assigned to a role'],
            ['name' => 'duplicate_roles', 'display_name' => 'Duplicate Roles', 'module' => 'roles', 'description' => 'Can duplicate existing roles'],
            
            // ===== PERMISSION MANAGEMENT =====
            ['name' => 'view_permissions', 'display_name' => 'View Permissions', 'module' => 'permissions', 'description' => 'Can view permission list and details'],
            ['name' => 'create_permissions', 'display_name' => 'Create Permissions', 'module' => 'permissions', 'description' => 'Can create new permissions'],
            ['name' => 'edit_permissions', 'display_name' => 'Edit Permissions', 'module' => 'permissions', 'description' => 'Can edit existing permissions'],
            ['name' => 'delete_permissions', 'display_name' => 'Delete Permissions', 'module' => 'permissions', 'description' => 'Can delete permissions'],
            ['name' => 'bulk_create_permissions', 'display_name' => 'Bulk Create Permissions', 'module' => 'permissions', 'description' => 'Can create multiple permissions at once'],
            ['name' => 'export_permissions', 'display_name' => 'Export Permissions', 'module' => 'permissions', 'description' => 'Can export permission data'],
            
            // ===== PROJECT MANAGEMENT =====
            ['name' => 'view_projects', 'display_name' => 'View Projects', 'module' => 'projects', 'description' => 'Can view project list and details'],
            ['name' => 'create_projects', 'display_name' => 'Create Projects', 'module' => 'projects', 'description' => 'Can create new projects'],
            ['name' => 'edit_projects', 'display_name' => 'Edit Projects', 'module' => 'projects', 'description' => 'Can edit existing projects'],
            ['name' => 'delete_projects', 'display_name' => 'Delete Projects', 'module' => 'projects', 'description' => 'Can delete projects'],
            ['name' => 'archive_projects', 'display_name' => 'Archive Projects', 'module' => 'projects', 'description' => 'Can archive projects'],
            ['name' => 'restore_projects', 'display_name' => 'Restore Projects', 'module' => 'projects', 'description' => 'Can restore archived projects'],
            ['name' => 'assign_project_members', 'display_name' => 'Assign Project Members', 'module' => 'projects', 'description' => 'Can assign members to projects'],
            ['name' => 'view_project_analytics', 'display_name' => 'View Project Analytics', 'module' => 'projects', 'description' => 'Can view project analytics and reports'],
            ['name' => 'export_project_data', 'display_name' => 'Export Project Data', 'module' => 'projects', 'description' => 'Can export project data'],
            
            // ===== DOCUMENT MANAGEMENT =====
            ['name' => 'view_documents', 'display_name' => 'View Documents', 'module' => 'documents', 'description' => 'Can view document list and details'],
            ['name' => 'create_documents', 'display_name' => 'Create Documents', 'module' => 'documents', 'description' => 'Can create new documents'],
            ['name' => 'edit_documents', 'display_name' => 'Edit Documents', 'module' => 'documents', 'description' => 'Can edit existing documents'],
            ['name' => 'delete_documents', 'display_name' => 'Delete Documents', 'module' => 'documents', 'description' => 'Can delete documents'],
            ['name' => 'upload_documents', 'display_name' => 'Upload Documents', 'module' => 'documents', 'description' => 'Can upload document files'],
            ['name' => 'download_documents', 'display_name' => 'Download Documents', 'module' => 'documents', 'description' => 'Can download document files'],
            ['name' => 'share_documents', 'display_name' => 'Share Documents', 'module' => 'documents', 'description' => 'Can share documents with others'],
            ['name' => 'version_documents', 'display_name' => 'Version Documents', 'module' => 'documents', 'description' => 'Can create document versions'],
            ['name' => 'approve_documents', 'display_name' => 'Approve Documents', 'module' => 'documents', 'description' => 'Can approve documents'],
            ['name' => 'archive_documents', 'display_name' => 'Archive Documents', 'module' => 'documents', 'description' => 'Can archive documents'],
            
            // ===== TASK MANAGEMENT =====
            ['name' => 'view_tasks', 'display_name' => 'View Tasks', 'module' => 'tasks', 'description' => 'Can view task list and details'],
            ['name' => 'create_tasks', 'display_name' => 'Create Tasks', 'module' => 'tasks', 'description' => 'Can create new tasks'],
            ['name' => 'edit_tasks', 'display_name' => 'Edit Tasks', 'module' => 'tasks', 'description' => 'Can edit existing tasks'],
            ['name' => 'delete_tasks', 'display_name' => 'Delete Tasks', 'module' => 'tasks', 'description' => 'Can delete tasks'],
            ['name' => 'assign_tasks', 'display_name' => 'Assign Tasks', 'module' => 'tasks', 'description' => 'Can assign tasks to users'],
            ['name' => 'complete_tasks', 'display_name' => 'Complete Tasks', 'module' => 'tasks', 'description' => 'Can mark tasks as complete'],
            ['name' => 'view_task_analytics', 'display_name' => 'View Task Analytics', 'module' => 'tasks', 'description' => 'Can view task analytics and reports'],
            
            // ===== CALENDAR & EVENTS =====
            ['name' => 'view_calendar', 'display_name' => 'View Calendar', 'module' => 'calendar', 'description' => 'Can view calendar and events'],
            ['name' => 'create_events', 'display_name' => 'Create Events', 'module' => 'calendar', 'description' => 'Can create calendar events'],
            ['name' => 'edit_events', 'display_name' => 'Edit Events', 'module' => 'calendar', 'description' => 'Can edit calendar events'],
            ['name' => 'delete_events', 'display_name' => 'Delete Events', 'module' => 'calendar', 'description' => 'Can delete calendar events'],
            ['name' => 'share_events', 'display_name' => 'Share Events', 'module' => 'calendar', 'description' => 'Can share events with others'],
            
            // ===== NOTIFICATIONS =====
            ['name' => 'view_notifications', 'display_name' => 'View Notifications', 'module' => 'notifications', 'description' => 'Can view notifications'],
            ['name' => 'create_notifications', 'display_name' => 'Create Notifications', 'module' => 'notifications', 'description' => 'Can create notifications'],
            ['name' => 'edit_notifications', 'display_name' => 'Edit Notifications', 'module' => 'notifications', 'description' => 'Can edit notifications'],
            ['name' => 'delete_notifications', 'display_name' => 'Delete Notifications', 'module' => 'notifications', 'description' => 'Can delete notifications'],
            ['name' => 'send_notifications', 'display_name' => 'Send Notifications', 'module' => 'notifications', 'description' => 'Can send notifications to users'],
            ['name' => 'manage_notification_settings', 'display_name' => 'Manage Notification Settings', 'module' => 'notifications', 'description' => 'Can manage notification settings'],
            
            // ===== REPORTS & ANALYTICS =====
            ['name' => 'view_reports', 'display_name' => 'View Reports', 'module' => 'reports', 'description' => 'Can view system reports'],
            ['name' => 'create_reports', 'display_name' => 'Create Reports', 'module' => 'reports', 'description' => 'Can create custom reports'],
            ['name' => 'edit_reports', 'display_name' => 'Edit Reports', 'module' => 'reports', 'description' => 'Can edit existing reports'],
            ['name' => 'delete_reports', 'display_name' => 'Delete Reports', 'module' => 'reports', 'description' => 'Can delete reports'],
            ['name' => 'export_reports', 'display_name' => 'Export Reports', 'module' => 'reports', 'description' => 'Can export reports'],
            ['name' => 'schedule_reports', 'display_name' => 'Schedule Reports', 'module' => 'reports', 'description' => 'Can schedule automated reports'],
            ['name' => 'view_analytics', 'display_name' => 'View Analytics', 'module' => 'analytics', 'description' => 'Can view analytics dashboard'],
            ['name' => 'view_system_metrics', 'display_name' => 'View System Metrics', 'module' => 'analytics', 'description' => 'Can view system performance metrics'],
            
            // ===== SETTINGS & CONFIGURATION =====
            ['name' => 'view_settings', 'display_name' => 'View Settings', 'module' => 'settings', 'description' => 'Can view system settings'],
            ['name' => 'edit_settings', 'display_name' => 'Edit Settings', 'module' => 'settings', 'description' => 'Can edit system settings'],
            ['name' => 'manage_system_config', 'display_name' => 'Manage System Configuration', 'module' => 'settings', 'description' => 'Can manage system configuration'],
            ['name' => 'manage_email_settings', 'display_name' => 'Manage Email Settings', 'module' => 'settings', 'description' => 'Can manage email configuration'],
            ['name' => 'manage_backup_settings', 'display_name' => 'Manage Backup Settings', 'module' => 'settings', 'description' => 'Can manage backup configuration'],
            ['name' => 'view_audit_logs', 'display_name' => 'View Audit Logs', 'module' => 'settings', 'description' => 'Can view system audit logs'],
            ['name' => 'manage_api_keys', 'display_name' => 'Manage API Keys', 'module' => 'settings', 'description' => 'Can manage API keys and tokens'],
            
            // ===== SECURITY =====
            ['name' => 'manage_security', 'display_name' => 'Manage Security', 'module' => 'security', 'description' => 'Can manage security settings'],
            ['name' => 'view_security_logs', 'display_name' => 'View Security Logs', 'module' => 'security', 'description' => 'Can view security logs'],
            ['name' => 'manage_two_factor', 'display_name' => 'Manage Two-Factor Authentication', 'module' => 'security', 'description' => 'Can manage 2FA settings'],
            ['name' => 'manage_ip_whitelist', 'display_name' => 'Manage IP Whitelist', 'module' => 'security', 'description' => 'Can manage IP whitelist'],
            ['name' => 'view_login_history', 'display_name' => 'View Login History', 'module' => 'security', 'description' => 'Can view user login history'],
            
            // ===== INTEGRATIONS =====
            ['name' => 'manage_integrations', 'display_name' => 'Manage Integrations', 'module' => 'integrations', 'description' => 'Can manage third-party integrations'],
            ['name' => 'view_integration_logs', 'display_name' => 'View Integration Logs', 'module' => 'integrations', 'description' => 'Can view integration logs'],
            ['name' => 'test_integrations', 'display_name' => 'Test Integrations', 'module' => 'integrations', 'description' => 'Can test integration connections'],
            
            // ===== BACKUP & MAINTENANCE =====
            ['name' => 'create_backups', 'display_name' => 'Create Backups', 'module' => 'maintenance', 'description' => 'Can create system backups'],
            ['name' => 'restore_backups', 'display_name' => 'Restore Backups', 'module' => 'maintenance', 'description' => 'Can restore system backups'],
            ['name' => 'view_backup_logs', 'display_name' => 'View Backup Logs', 'module' => 'maintenance', 'description' => 'Can view backup logs'],
            ['name' => 'run_maintenance', 'display_name' => 'Run Maintenance', 'module' => 'maintenance', 'description' => 'Can run system maintenance tasks'],
            ['name' => 'clear_cache', 'display_name' => 'Clear Cache', 'module' => 'maintenance', 'description' => 'Can clear system cache'],
            ['name' => 'optimize_database', 'display_name' => 'Optimize Database', 'module' => 'maintenance', 'description' => 'Can optimize database performance'],
            
            // ===== GENERAL ACCESS =====
            ['name' => 'access_dashboard', 'display_name' => 'Access Dashboard', 'module' => 'general', 'description' => 'Can access the main dashboard'],
            ['name' => 'view_help', 'display_name' => 'View Help', 'module' => 'general', 'description' => 'Can access help documentation'],
            ['name' => 'contact_support', 'display_name' => 'Contact Support', 'module' => 'general', 'description' => 'Can contact support team'],
            ['name' => 'view_activity_feed', 'display_name' => 'View Activity Feed', 'module' => 'general', 'description' => 'Can view system activity feed'],
            ['name' => 'search_system', 'display_name' => 'Search System', 'module' => 'general', 'description' => 'Can search across the system'],
            
            // ===== SRS (SOFTWARE REQUIREMENTS SPECIFICATION) =====
            ['name' => 'view_srs_overview', 'display_name' => 'View SRS Overview', 'module' => 'srs', 'description' => 'Can view SRS overview and dashboard'],
            ['name' => 'view_srs_documents', 'display_name' => 'View SRS Documents', 'module' => 'srs', 'description' => 'Can view SRS document list and details'],
            ['name' => 'create_srs_documents', 'display_name' => 'Create SRS Documents', 'module' => 'srs', 'description' => 'Can create new SRS documents'],
            ['name' => 'edit_srs_documents', 'display_name' => 'Edit SRS Documents', 'module' => 'srs', 'description' => 'Can edit existing SRS documents'],
            ['name' => 'delete_srs_documents', 'display_name' => 'Delete SRS Documents', 'module' => 'srs', 'description' => 'Can delete SRS documents'],
            ['name' => 'approve_srs_documents', 'display_name' => 'Approve SRS Documents', 'module' => 'srs', 'description' => 'Can approve SRS documents for release'],
            ['name' => 'version_srs_documents', 'display_name' => 'Version SRS Documents', 'module' => 'srs', 'description' => 'Can create new versions of SRS documents'],
            ['name' => 'export_srs_documents', 'display_name' => 'Export SRS Documents', 'module' => 'srs', 'description' => 'Can export SRS documents to various formats'],
            ['name' => 'import_srs_documents', 'display_name' => 'Import SRS Documents', 'module' => 'srs', 'description' => 'Can import SRS documents from external sources'],
            
            // SRS Sections Management
            ['name' => 'manage_srs_introduction', 'display_name' => 'Manage SRS Introduction', 'module' => 'srs', 'description' => 'Can manage the Introduction section of SRS documents'],
            ['name' => 'manage_srs_overall_description', 'display_name' => 'Manage SRS Overall Description', 'module' => 'srs', 'description' => 'Can manage the Overall Description section of SRS documents'],
            ['name' => 'manage_srs_functional_requirements', 'display_name' => 'Manage SRS Functional Requirements', 'module' => 'srs', 'description' => 'Can manage Functional Requirements in SRS documents'],
            ['name' => 'manage_srs_non_functional_requirements', 'display_name' => 'Manage SRS Non-Functional Requirements', 'module' => 'srs', 'description' => 'Can manage Non-Functional Requirements in SRS documents'],
            ['name' => 'manage_srs_external_interfaces', 'display_name' => 'Manage SRS External Interfaces', 'module' => 'srs', 'description' => 'Can manage External Interfaces section in SRS documents'],
            ['name' => 'manage_srs_performance_requirements', 'display_name' => 'Manage SRS Performance Requirements', 'module' => 'srs', 'description' => 'Can manage Performance Requirements in SRS documents'],
            ['name' => 'manage_srs_design_constraints', 'display_name' => 'Manage SRS Design Constraints', 'module' => 'srs', 'description' => 'Can manage Design Constraints in SRS documents'],
            ['name' => 'manage_srs_software_attributes', 'display_name' => 'Manage SRS Software Attributes', 'module' => 'srs', 'description' => 'Can manage Software Attributes in SRS documents'],
            ['name' => 'manage_srs_appendices', 'display_name' => 'Manage SRS Appendices', 'module' => 'srs', 'description' => 'Can manage Appendices section in SRS documents'],
            
            // SRS Requirements Management
            ['name' => 'view_srs_requirements', 'display_name' => 'View SRS Requirements', 'module' => 'srs', 'description' => 'Can view SRS requirements list and details'],
            ['name' => 'create_srs_requirements', 'display_name' => 'Create SRS Requirements', 'module' => 'srs', 'description' => 'Can create new SRS requirements'],
            ['name' => 'edit_srs_requirements', 'display_name' => 'Edit SRS Requirements', 'module' => 'srs', 'description' => 'Can edit existing SRS requirements'],
            ['name' => 'delete_srs_requirements', 'display_name' => 'Delete SRS Requirements', 'module' => 'srs', 'description' => 'Can delete SRS requirements'],
            ['name' => 'prioritize_srs_requirements', 'display_name' => 'Prioritize SRS Requirements', 'module' => 'srs', 'description' => 'Can set priority levels for SRS requirements'],
            ['name' => 'categorize_srs_requirements', 'display_name' => 'Categorize SRS Requirements', 'module' => 'srs', 'description' => 'Can categorize SRS requirements by type'],
            ['name' => 'validate_srs_requirements', 'display_name' => 'Validate SRS Requirements', 'module' => 'srs', 'description' => 'Can validate SRS requirements for completeness'],
            ['name' => 'approve_srs_requirements', 'display_name' => 'Approve SRS Requirements', 'module' => 'srs', 'description' => 'Can approve SRS requirements for implementation'],
            
            // SRS Traceability
            ['name' => 'view_srs_traceability', 'display_name' => 'View SRS Traceability', 'module' => 'srs', 'description' => 'Can view requirements traceability matrix'],
            ['name' => 'manage_srs_traceability', 'display_name' => 'Manage SRS Traceability', 'module' => 'srs', 'description' => 'Can manage requirements traceability relationships'],
            ['name' => 'export_traceability_matrix', 'display_name' => 'Export Traceability Matrix', 'module' => 'srs', 'description' => 'Can export traceability matrix reports'],
            
            // SRS Stakeholders
            ['name' => 'view_srs_stakeholders', 'display_name' => 'View SRS Stakeholders', 'module' => 'srs', 'description' => 'Can view stakeholder information for SRS projects'],
            ['name' => 'manage_srs_stakeholders', 'display_name' => 'Manage SRS Stakeholders', 'module' => 'srs', 'description' => 'Can manage stakeholder details and relationships'],
            ['name' => 'assign_stakeholder_roles', 'display_name' => 'Assign Stakeholder Roles', 'module' => 'srs', 'description' => 'Can assign roles and responsibilities to stakeholders'],
            
            // SRS Validation
            ['name' => 'view_srs_validation', 'display_name' => 'View SRS Validation', 'module' => 'srs', 'description' => 'Can view SRS validation status and results'],
            ['name' => 'run_srs_validation', 'display_name' => 'Run SRS Validation', 'module' => 'srs', 'description' => 'Can run validation checks on SRS documents'],
            ['name' => 'approve_srs_validation', 'display_name' => 'Approve SRS Validation', 'module' => 'srs', 'description' => 'Can approve SRS validation results'],
            ['name' => 'view_validation_reports', 'display_name' => 'View Validation Reports', 'module' => 'srs', 'description' => 'Can view detailed validation reports'],
            
            // SRS Collaboration
            ['name' => 'view_srs_collaboration', 'display_name' => 'View SRS Collaboration', 'module' => 'srs', 'description' => 'Can view collaboration features and discussions'],
            ['name' => 'participate_srs_reviews', 'display_name' => 'Participate in SRS Reviews', 'module' => 'srs', 'description' => 'Can participate in SRS document reviews'],
            ['name' => 'initiate_srs_reviews', 'display_name' => 'Initiate SRS Reviews', 'module' => 'srs', 'description' => 'Can initiate review processes for SRS documents'],
            ['name' => 'approve_srs_reviews', 'display_name' => 'Approve SRS Reviews', 'module' => 'srs', 'description' => 'Can approve review comments and changes'],
            ['name' => 'manage_review_workflows', 'display_name' => 'Manage Review Workflows', 'module' => 'srs', 'description' => 'Can manage review workflow configurations'],
            
            // SRS Modeling
            ['name' => 'view_srs_modeling', 'display_name' => 'View SRS Modeling', 'module' => 'srs', 'description' => 'Can view UML diagrams and modeling tools'],
            ['name' => 'create_srs_models', 'display_name' => 'Create SRS Models', 'module' => 'srs', 'description' => 'Can create UML diagrams and models for SRS'],
            ['name' => 'edit_srs_models', 'display_name' => 'Edit SRS Models', 'module' => 'srs', 'description' => 'Can edit existing UML diagrams and models'],
            ['name' => 'delete_srs_models', 'display_name' => 'Delete SRS Models', 'module' => 'srs', 'description' => 'Can delete UML diagrams and models'],
            ['name' => 'export_srs_models', 'display_name' => 'Export SRS Models', 'module' => 'srs', 'description' => 'Can export UML diagrams and models'],
            
            // SRS Export & Integration
            ['name' => 'view_srs_export', 'display_name' => 'View SRS Export Options', 'module' => 'srs', 'description' => 'Can view available export formats and options'],
            ['name' => 'export_srs_pdf', 'display_name' => 'Export SRS to PDF', 'module' => 'srs', 'description' => 'Can export SRS documents to PDF format'],
            ['name' => 'export_srs_word', 'display_name' => 'Export SRS to Word', 'module' => 'srs', 'description' => 'Can export SRS documents to Word format'],
            ['name' => 'export_srs_html', 'display_name' => 'Export SRS to HTML', 'module' => 'srs', 'description' => 'Can export SRS documents to HTML format'],
            ['name' => 'export_srs_xml', 'display_name' => 'Export SRS to XML', 'module' => 'srs', 'description' => 'Can export SRS documents to XML format'],
            ['name' => 'integrate_srs_tools', 'display_name' => 'Integrate SRS Tools', 'module' => 'srs', 'description' => 'Can integrate with external SRS tools and systems'],
            ['name' => 'sync_srs_data', 'display_name' => 'Sync SRS Data', 'module' => 'srs', 'description' => 'Can synchronize SRS data with external systems'],
            
            // SRS AI Features
            ['name' => 'use_srs_ai_generation', 'display_name' => 'Use SRS AI Generation', 'module' => 'srs', 'description' => 'Can use AI-powered SRS document generation'],
            ['name' => 'use_srs_ai_analysis', 'display_name' => 'Use SRS AI Analysis', 'module' => 'srs', 'description' => 'Can use AI-powered analysis of SRS documents'],
            ['name' => 'use_srs_ai_suggestions', 'display_name' => 'Use SRS AI Suggestions', 'module' => 'srs', 'description' => 'Can use AI-powered suggestions for SRS improvement'],
            ['name' => 'manage_srs_ai_settings', 'display_name' => 'Manage SRS AI Settings', 'module' => 'srs', 'description' => 'Can manage AI feature settings and configurations'],
        ];

        foreach ($permissions as $permissionData) {
            Permission::create($permissionData);
        }

        // Create roles
        $adminRole = Role::create([
            'name' => 'admin',
            'display_name' => 'Administrator',
            'description' => 'Full system administrator with all permissions',
            'is_active' => true
        ]);

        $managerRole = Role::create([
            'name' => 'manager',
            'display_name' => 'Project Manager',
            'description' => 'Can manage projects and documents',
            'is_active' => true
        ]);

        $userRole = Role::create([
            'name' => 'user',
            'display_name' => 'Regular User',
            'description' => 'Basic user with limited permissions',
            'is_active' => true
        ]);

        $srsSpecialistRole = Role::create([
            'name' => 'srs_specialist',
            'display_name' => 'SRS Specialist',
            'description' => 'Technical writer or requirements engineer with full SRS capabilities',
            'is_active' => true
        ]);

        // Assign permissions to roles
        $adminRole->assignPermissions(Permission::pluck('id')->toArray());
        
        // Manager permissions - Project and document management focused
        $managerPermissions = Permission::whereIn('name', [
            // General access
            'access_dashboard',
            'view_analytics',
            'view_activity_feed',
            'search_system',
            'view_help',
            'contact_support',
            
            // User management (limited)
            'view_users',
            'view_user_profile',
            'assign_user_roles',
            
            // Project management (full)
            'view_projects',
            'create_projects',
            'edit_projects',
            'delete_projects',
            'archive_projects',
            'restore_projects',
            'assign_project_members',
            'view_project_analytics',
            'export_project_data',
            
            // Document management (full)
            'view_documents',
            'create_documents',
            'edit_documents',
            'delete_documents',
            'upload_documents',
            'download_documents',
            'share_documents',
            'version_documents',
            'approve_documents',
            'archive_documents',
            
            // Task management (full)
            'view_tasks',
            'create_tasks',
            'edit_tasks',
            'delete_tasks',
            'assign_tasks',
            'complete_tasks',
            'view_task_analytics',
            
            // Calendar & events
            'view_calendar',
            'create_events',
            'edit_events',
            'delete_events',
            'share_events',
            
            // Notifications
            'view_notifications',
            'create_notifications',
            'edit_notifications',
            'send_notifications',
            
            // Reports (limited)
            'view_reports',
            'create_reports',
            'edit_reports',
            'export_reports',
            
            // Settings (limited)
            'view_settings',
            'edit_settings',
            
            // SRS Management (full for managers)
            'view_srs_overview',
            'view_srs_documents',
            'create_srs_documents',
            'edit_srs_documents',
            'delete_srs_documents',
            'approve_srs_documents',
            'version_srs_documents',
            'export_srs_documents',
            'import_srs_documents',
            'manage_srs_introduction',
            'manage_srs_overall_description',
            'manage_srs_functional_requirements',
            'manage_srs_non_functional_requirements',
            'manage_srs_external_interfaces',
            'manage_srs_performance_requirements',
            'manage_srs_design_constraints',
            'manage_srs_software_attributes',
            'manage_srs_appendices',
            'view_srs_requirements',
            'create_srs_requirements',
            'edit_srs_requirements',
            'delete_srs_requirements',
            'prioritize_srs_requirements',
            'categorize_srs_requirements',
            'validate_srs_requirements',
            'approve_srs_requirements',
            'view_srs_traceability',
            'manage_srs_traceability',
            'export_traceability_matrix',
            'view_srs_stakeholders',
            'manage_srs_stakeholders',
            'assign_stakeholder_roles',
            'view_srs_validation',
            'run_srs_validation',
            'approve_srs_validation',
            'view_validation_reports',
            'view_srs_collaboration',
            'participate_srs_reviews',
            'initiate_srs_reviews',
            'approve_srs_reviews',
            'manage_review_workflows',
            'view_srs_modeling',
            'create_srs_models',
            'edit_srs_models',
            'delete_srs_models',
            'export_srs_models',
            'view_srs_export',
            'export_srs_pdf',
            'export_srs_word',
            'export_srs_html',
            'export_srs_xml',
            'integrate_srs_tools',
            'sync_srs_data',
            'use_srs_ai_generation',
            'use_srs_ai_analysis',
            'use_srs_ai_suggestions',
            'manage_srs_ai_settings',
        ])->pluck('id')->toArray();
        $managerRole->assignPermissions($managerPermissions);
        
        // SRS Specialist permissions - Full SRS capabilities
        $srsSpecialistPermissions = Permission::whereIn('name', [
            // General access
            'access_dashboard',
            'view_activity_feed',
            'search_system',
            'view_help',
            'contact_support',
            
            // Project management (view only)
            'view_projects',
            
            // Document management (full for SRS)
            'view_documents',
            'create_documents',
            'edit_documents',
            'delete_documents',
            'upload_documents',
            'download_documents',
            'share_documents',
            'version_documents',
            'approve_documents',
            'archive_documents',
            
            // SRS Management (full capabilities)
            'view_srs_overview',
            'view_srs_documents',
            'create_srs_documents',
            'edit_srs_documents',
            'delete_srs_documents',
            'approve_srs_documents',
            'version_srs_documents',
            'export_srs_documents',
            'import_srs_documents',
            'manage_srs_introduction',
            'manage_srs_overall_description',
            'manage_srs_functional_requirements',
            'manage_srs_non_functional_requirements',
            'manage_srs_external_interfaces',
            'manage_srs_performance_requirements',
            'manage_srs_design_constraints',
            'manage_srs_software_attributes',
            'manage_srs_appendices',
            'view_srs_requirements',
            'create_srs_requirements',
            'edit_srs_requirements',
            'delete_srs_requirements',
            'prioritize_srs_requirements',
            'categorize_srs_requirements',
            'validate_srs_requirements',
            'approve_srs_requirements',
            'view_srs_traceability',
            'manage_srs_traceability',
            'export_traceability_matrix',
            'view_srs_stakeholders',
            'manage_srs_stakeholders',
            'assign_stakeholder_roles',
            'view_srs_validation',
            'run_srs_validation',
            'approve_srs_validation',
            'view_validation_reports',
            'view_srs_collaboration',
            'participate_srs_reviews',
            'initiate_srs_reviews',
            'approve_srs_reviews',
            'manage_review_workflows',
            'view_srs_modeling',
            'create_srs_models',
            'edit_srs_models',
            'delete_srs_models',
            'export_srs_models',
            'view_srs_export',
            'export_srs_pdf',
            'export_srs_word',
            'export_srs_html',
            'export_srs_xml',
            'integrate_srs_tools',
            'sync_srs_data',
            'use_srs_ai_generation',
            'use_srs_ai_analysis',
            'use_srs_ai_suggestions',
            'manage_srs_ai_settings',
        ])->pluck('id')->toArray();
        $srsSpecialistRole->assignPermissions($srsSpecialistPermissions);

        // User permissions - Basic access
        $userPermissions = Permission::whereIn('name', [
            // General access
            'access_dashboard',
            'view_activity_feed',
            'search_system',
            'view_help',
            'contact_support',
            
            // Project management (view only)
            'view_projects',
            
            // Document management (limited)
            'view_documents',
            'download_documents',
            'share_documents',
            
            // Task management (limited)
            'view_tasks',
            'complete_tasks',
            
            // Calendar & events (limited)
            'view_calendar',
            'create_events',
            'edit_events',
            
            // Notifications (view only)
            'view_notifications',
            
            // Reports (view only)
            'view_reports',
            
            // SRS Management (limited for regular users)
            'view_srs_overview',
            'view_srs_documents',
            'view_srs_requirements',
            'view_srs_traceability',
            'view_srs_stakeholders',
            'view_srs_validation',
            'view_srs_collaboration',
            'view_srs_modeling',
            'view_srs_export',
            'export_srs_pdf',
            'export_srs_word',
            'use_srs_ai_generation',
            'use_srs_ai_suggestions',
        ])->pluck('id')->toArray();
        $userRole->assignPermissions($userPermissions);

        // Create users
        $adminUser = User::create([
            'name' => 'System Administrator',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'bio' => 'System administrator with full access to all features'
        ]);
        $adminUser->assignRoles([$adminRole->id]);

        $managerUser = User::create([
            'name' => 'Project Manager',
            'username' => 'manager',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'bio' => 'Project manager responsible for overseeing project development'
        ]);
        $managerUser->assignRoles([$managerRole->id]);

        $regularUser = User::create([
            'name' => 'Regular User',
            'username' => 'user',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'bio' => 'Regular user with basic access to the system'
        ]);
        $regularUser->assignRoles([$userRole->id]);

        $srsSpecialistUser = User::create([
            'name' => 'SRS Specialist',
            'username' => 'srs_specialist',
            'email' => 'srs@example.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'bio' => 'Technical writer and requirements engineer with expertise in SRS development'
        ]);
        $srsSpecialistUser->assignRoles([$srsSpecialistRole->id]);
    }
}


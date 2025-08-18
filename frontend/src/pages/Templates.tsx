import { PlusIcon } from '@heroicons/react/24/outline'

const Templates = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage document templates for consistent documentation.
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Template
        </button>
      </div>
      
      <div className="card">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Templates Coming Soon</h3>
          <p className="text-gray-500">Template management functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  )
}

export default Templates








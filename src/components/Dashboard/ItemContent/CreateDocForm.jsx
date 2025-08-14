import { useState } from 'react'
import { Modal } from 'react-simplicity-lib'

const CreateDocForm = ({ isOpen, onClose, onCreate, type, style }) => {
  const [formData, setFormData] = useState({ name: '', description: '' })

  const handleCreate = () => {
    if (!formData.name.trim()) return
    onCreate(formData)
    setFormData({ name: '', description: '' })
  }

  const handleClose = () => {
    onClose()
    setFormData({ name: '', description: '' })
  }

  return (
    <Modal isOpen={isOpen} onModalClose={handleClose} style={style}>
      <div className="w-96 p-6 bg-white rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Create New {type?.slice(0, -1)}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter document name"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description (optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
              placeholder="Brief description of the document"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!formData.name.trim()}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default CreateDocForm
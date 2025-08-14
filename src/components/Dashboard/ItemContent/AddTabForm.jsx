import { useState } from 'react'
import { Modal } from 'react-simplicity-lib'

const AddTabForm = ({ isOpen, onClose, onAddTab, style }) => {
  const [tabName, setTabName] = useState('')

  const handleAdd = () => {
    if (!tabName.trim()) return
    onAddTab(tabName.trim())
    setTabName('')
  }

  const handleClose = () => {
    onClose()
    setTabName('')
  }

  return (
    <Modal isOpen={isOpen} onModalClose={handleClose} style={style}>
      <div className="w-96 p-6 bg-white rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Tab</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tab Name *</label>
            <input
              type="text"
              value={tabName}
              onChange={(e) => setTabName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Flashcards, Summaries, etc."
              autoFocus
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
            onClick={handleAdd}
            disabled={!tabName.trim()}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Tab
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AddTabForm
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import ConfirmDialog from '../../common/ConfirmDialog'

const DocumentList = ({ type, items, onCreateNew, onDocumentClick, onDeleteDocument }) => {
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  return (
    <>
      <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{type}</h3>
        <button
          onClick={() => onCreateNew(type)}
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          <Plus size={16} />
          New {type.slice(0, -1)}
        </button>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No {type.toLowerCase()} yet</p>
          <p className="text-sm">Click "New {type.slice(0, -1)}" to create your first document</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div 
              key={item.id} 
              className="border rounded-lg p-3 hover:bg-gray-50 transition-colors flex justify-between items-start"
            >
              <div 
                onClick={() => onDocumentClick(item)}
                className="flex-1 cursor-pointer"
              >
                <h4 className="font-medium">{item.title}</h4>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  Created: {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDialog({
                    title: 'Delete Document',
                    message: `Delete "${item.title}"? This action cannot be undone.`,
                    onConfirm: () => onDeleteDocument(item.id)
                  });
                }}
                className="text-red-500 hover:text-red-700 p-1 ml-2"
                title="Delete document"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      </div>
      
      <ConfirmDialog
        isOpen={!!confirmDialog}
        onClose={() => setConfirmDialog(null)}
        onConfirm={confirmDialog?.onConfirm}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        style={{ zIndex: 9999999 }}
      />
    </>
  )
}

export default DocumentList
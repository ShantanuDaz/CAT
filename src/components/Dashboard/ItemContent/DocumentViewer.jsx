import { Modal } from 'react-simplicity-lib'
import { ExternalLink, ArrowLeft } from 'lucide-react'

const DocumentViewer = ({ isOpen, onClose, document, style }) => {
  if (!document) return null

  return (
    <Modal isOpen={isOpen} onModalClose={onClose} style={style}>
      <div className="w-[95vw] h-[95vh] flex flex-col bg-white rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={16} />
            Back to List
          </button>
          <h2 className="text-lg font-semibold">{document.title}</h2>
          <button
            onClick={() => window.open(document.googleDocUrl, '_blank')}
            className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
          >
            <ExternalLink size={16} />
            Open in New Tab
          </button>
        </div>
        <iframe
          src={document.embedUrl}
          className="flex-1 w-full border-0"
          title={document.title}
        />
      </div>
    </Modal>
  )
}

export default DocumentViewer
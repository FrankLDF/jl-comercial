import React from 'react'
import { Modal, Button } from 'antd'

interface DocumentPreviewModalProps {
  visible: boolean
  onCancel: () => void
  url: string | null
  title: string
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  visible,
  onCancel,
  url,
  title,
}) => {
  const handlePrint = () => {
    const iframe = document.getElementById('document-preview-iframe') as HTMLIFrameElement
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
    }
  }

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      width="1000px"
      style={{ top: 20 }}
      footer={[
        <Button key="close" onClick={onCancel}>
          Cerrar
        </Button>,
        <Button key="print" type="primary" onClick={handlePrint}>
          Imprimir
        </Button>,
      ]}
      destroyOnClose
    >
      <div style={{ height: '80vh', width: '100%' }}>
        {url ? (
          <iframe
            id="document-preview-iframe"
            src={url}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={title}
          />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Cargando documento...
          </div>
        )}
      </div>
    </Modal>
  )
}

export default DocumentPreviewModal

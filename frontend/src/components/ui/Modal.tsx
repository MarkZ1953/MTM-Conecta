import { Dialog } from 'primereact/dialog'
import type { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog
      visible={isOpen}
      onHide={onClose}
      header={title}
      modal
      style={{ width: '90vw', maxWidth: '500px' }}
      className="p-fluid"
    >
      {children}
    </Dialog>
  )
}

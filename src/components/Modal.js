import { useEffect } from 'react'
import Button from './Button'

export default function Modal({ isOpen, onClose, title, children, onConfirm }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black opacity-40" onClick={onClose} />
                <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
                        <div className="mt-2">{children}</div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <Button onClick={onClose} className="bg-gray-500 rounded">
                                Отмена
                            </Button>
                            {onConfirm && (
                                <Button onClick={onConfirm} className="bg-red-500 rounded">
                                    Подтвердить
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 
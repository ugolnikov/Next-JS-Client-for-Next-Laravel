'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import ProductForm from '@/components/ProductForm'
import Button from '@/components/Button'
import Modal from '@/components/Modal'

export default function CreateProduct() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')

    const handleSubmit = async (formData) => {
        setIsLoading(true)
        try {
            const form = new FormData()
            
            form.append('name', formData.name)
            form.append('price', formData.price)
            form.append('unit', formData.unit)
            form.append('short_description', formData.description)
            form.append('full_description', formData.full_description)

            if (formData.image_preview) {
                form.append('image_preview', formData.image_preview)
            }

            if (formData.images && formData.images.length > 0) {
                formData.images.forEach((image, index) => {
                    form.append(`images[${index}]`, image)
                })
            }

            await axios.post('/api/seller/products', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            setModalMessage('Товар успешно создан!')
            setShowModal(true)
            setTimeout(() => {
                router.push('/dashboard/goods')
            }, 2000)
        } catch (error) {
            setModalMessage('Ошибка при создании товара')
            setShowModal(true)
            throw new Error('Ошибка при создании товара:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                onClick={() => router.back()}
                className="mb-6 rounded">
                Назад
            </Button>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Создание товара</h1>
                <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Уведомление">
                <p>{modalMessage}</p>
            </Modal>
        </div>
    )
} 
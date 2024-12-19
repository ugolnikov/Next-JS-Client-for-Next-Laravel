'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import ProductForm from '@/components/ProductForm'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import Loader from '@/components/Loader'

export default function EditProduct({ params }) {
    const router = useRouter()
    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/seller/products/${params.id}`)
                setProduct(response.data)
            } catch (error) {
                setModalMessage('Ошибка при загрузке товара')
                setShowModal(true)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProduct()
    }, [params.id])

    const handleSubmit = async (formData) => {
        setIsSaving(true)
        try {
            const form = new FormData()
            
            form.append('name', formData.name)
            form.append('price', formData.price)
            form.append('unit', formData.unit)
            form.append('short_description', formData.description)
            form.append('full_description', formData.full_description)

            if (formData.images && formData.images.length > 0) {
                await Promise.all(formData.images.map(async (image, index) => {
                    if (image instanceof File) {
                        form.append(`images[${index}]`, image)
                    } else if (typeof image === 'string' && image.startsWith('data:image')) {
                        const response = await fetch(image)
                        const blob = await response.blob()
                        const file = new File([blob], `image-${index}.jpg`, { type: 'image/jpeg' })
                        form.append(`images[${index}]`, file)
                    }
                }))
            }

            await axios.put(`/api/seller/products/${params.id}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            setModalMessage('Товар успешно обновлен!')
            setShowModal(true)
            setTimeout(() => {
                router.push('/dashboard/goods')
            }, 2000)
        } catch (error) {
            setModalMessage('Ошибка при обновлении товара')
            setShowModal(true)
            throw new Error('Ошибка при обновлении:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <Loader />

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                onClick={() => router.back()}
                className="mb-6 rounded">
                Назад
            </Button>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Редактирование товара</h1>
                <ProductForm
                    initialData={product}
                    onSubmit={handleSubmit}
                    isLoading={isSaving}
                />
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
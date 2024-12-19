'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'
import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import Loader from '@/components/Loader'
import Button from '@/components/Button'
import ImageWithLoader from '@/components/ImageWithLoader'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Modal from '@/components/Modal'
import Header from '@/components/Header'

export default function GoodsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [selectedProductId, setSelectedProductId] = useState(null)

    useEffect(() => {
        if (!user || user.role !== 'seller') {
            router.push('/login')
            return
        }
        fetchProducts()
    }, [user])

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/seller/products')
            setProducts(response.data.data)
        } catch (err) {
            setError('Ошибка при загрузке товаров')
        } finally {
            setLoading(false)
        }
    }

    const handlePublishToggle = async (productId) => {
        try {
            await axios.put(`/api/seller/products/${productId}/toggle-publish`)
            fetchProducts()
        } catch (error) {
            throw new Error('Ошибка при изменении статуса публикации:', error)
        }
    }

    const handleDelete = async productId => {
        setSelectedProductId(productId)
        setModalMessage('Вы уверены, что хотите удалить этот товар?')
        setShowModal(true)
    }

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/seller/products/${selectedProductId}`)
            await fetchProducts()
            setModalMessage('Товар успешно удален')
            setTimeout(() => setShowModal(false), 2000)
        } catch (error) {
            setModalMessage('Ошибка при удалении товара')
        }
    }

    if (loading) return <Loader />
    if (error) return <div className="text-center text-red-500">{error}</div>
    return (
        <>

            <Header title="Управление товарами" />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                <Button
                    onClick={() => router.push('/dashboard/goods/create')}
                    className="rounded">
                    Добавить товар
                </Button>
            </div>

            {products.length === 0 ? (
                <p>У вас нет товаров</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="h-64 relative">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    navigation
                                    pagination={{ clickable: true }}
                                    className="h-full w-full">
                                    {[
                                        product.image_preview,
                                        ...JSON.parse(product.images || '[]'),
                                    ]
                                        .filter(Boolean)
                                        .map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="flex items-center justify-center h-full bg-gray-50">
                                                    <ImageWithLoader
                                                        src={image}
                                                        alt={`${product.name} - изображение ${index + 1}`}
                                                        width={300}
                                                        height={300}
                                                        style={{
                                                            objectFit:
                                                                'contain',
                                                        }}
                                                        className="object-contain h-full w-full"
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                </Swiper>
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2 truncate">
                                    {product.name}
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Цена: {product.price}₽
                                </p>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() =>
                                            handlePublishToggle(
                                                product.id,
                                                product.is_published,
                                            )
                                        }
                                        className={`w-full rounded ${
                                            product.is_published
                                                ? 'bg-green-500'
                                                : 'bg-gray-500'
                                        }`}>
                                        {product.is_published
                                            ? 'Опубликован'
                                            : 'Черновик'}
                                    </Button>
                                    <div className="flex gap-2 w-full">
                                        <Button
                                            onClick={() =>
                                                router.push(
                                                    `/dashboard/goods/edit/${product.id}`,
                                                )
                                            }
                                            className="rounded bg-blue-500 w-1/2">
                                            Изменить
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                            className="rounded bg-red-500 w-1/2">
                                            Удалить
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Подтверждение"
                onConfirm={
                    modalMessage ===
                    'Вы уверены, что хотите удалить этот товар?'
                        ? confirmDelete
                        : undefined
                }>
                <p>{modalMessage}</p>
            </Modal>
        </div>
        </>)
}

'use client'
import axios from '@/lib/axios'
import { useState, useEffect } from 'react'
import Loader from '@/components/Loader'
import Button from '@/components/Button'
import { useRouter } from 'next/navigation'
import ImageWithLoader from '@/components/ImageWithLoader'
import Modal from '@/components/Modal'

const loadOrder = async orderNumber => {
    const url = `/api/orders/${orderNumber}`
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            return null
        }
        throw error
    }
}

export default function Page({ params }) {
    const router = useRouter()
    const [orderNumber, setOrderNumber] = useState(null)
    const [order, setOrder] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [ setSelectedOrderId] = useState(null)

    const fetchOrder = async () => {
        if (!orderNumber) return
        try {
            setIsLoading(true)
            setIsError(false)
            setNotFound(false)
            const data = await loadOrder(orderNumber)
            if (data === null) {
                setNotFound(true)
            } else {
                setOrder(data)
            }
        } catch (error) {
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchOrderNumber = async () => {
            const resolvedParams = await params
            if (resolvedParams?.slug) {
                setOrderNumber(resolvedParams.slug)
            }
        }

        fetchOrderNumber()
    }, [params])

    useEffect(() => {
        fetchOrder()
    }, [orderNumber])

    const handleSend = async () => {
        setSelectedOrderId(orderNumber)
        setModalMessage('Вы уверены, что получили этот товар?')
        setShowModal(true)
    }

    const confirmSend = async () => {
        try {
            await axios.put(`/api/orders/${orderNumber}/status`, {
                status: 'completed',
                orderNumber: orderNumber,
            })
            await fetchOrder()
            setModalMessage('Товар успешно доставлен')
            setTimeout(() => setShowModal(false), 2000)
        } catch (error) {
            setModalMessage('Ошибка при подтверждении товара')
            throw new Error(error)
        }
    }

    if (isLoading) return <Loader />
    if (notFound)
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-3xl font-bold mb-4">Заказ не найден</h1>
                <p className="text-gray-600">
                    К сожалению, запрашиваемый заказ не существует.
                </p>
            </div>
        )
    if (isError) return <p>Ошибка загрузки заказа</p>
    if (!order) return <p>Заказ не найден</p>

    const getStatusColor = status => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'shipped':
                return 'bg-blue-100 text-blue-800'
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = status => {
        switch (status) {
            case 'pending':
                return 'Ожидает обработки'
            case 'shipped':
                return 'Доставлен'
            case 'completed':
                return 'Выполнен'
            case 'cancelled':
                return 'Отменён'
            default:
                return status
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Button className="mb-6 rounded" onClick={() => router.back()}>
                    <svg
                        fill="white"
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 476.213 476.213">
                        <polygon
                            points="476.213,223.107 57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 
                            57.427,253.107 476.213,253.107"
                        />
                    </svg>
                    Назад
                </Button>

                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Заказ #{order.order_number}
                            </h1>
                            {order.status === 'shipped' && (
                                <Button
                                    onClick={handleSend}
                                    className="rounded">
                                    Подтвердить получение
                                </Button>
                            )}

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                    order.status,
                                )}`}>
                                {getStatusText(order.status)}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4">
                                Информация о заказе
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">
                                        Дата заказа:{' '}
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleDateString('ru-RU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p className="text-gray-600">
                                        Сумма заказа: {order.total_amount} ₽
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">
                                        Имя: {order.full_name}
                                    </p>
                                    <p className="text-gray-600">
                                        Email: {order.email}
                                    </p>
                                    <p className="text-gray-600">
                                        Телефон: {order.phone}
                                    </p>
                                    <p className="text-gray-600">
                                        Адрес: {order.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-4">
                                Товары в заказе
                            </h2>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center border rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex-shrink-0 w-20 h-20 mr-4">
                                            <ImageWithLoader
                                                src={item.product.image_preview}
                                                alt={item.product.name}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-gray-900">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-gray-600">
                                                Количество: {item.quantity}
                                            </p>
                                            <p className="text-gray-600">
                                                Цена за единицу:{' '}
                                                {item.product.price} ₽
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                {item.is_send ? (
                                                    <span className="text-green-600">
                                                        Отправлен
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600">
                                                        Не отправлен
                                                    </span>
                                                )}
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {item.product.price *
                                                    item.quantity}{' '}
                                                ₽
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Подтверждение"
                onConfirm={
                    modalMessage === 'Вы уверены, что получили этот товар?'
                        ? confirmSend
                        : undefined
                }>
                <p>{modalMessage}</p>
            </Modal>
        </div>
    )
}

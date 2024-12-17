'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'
import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import Loader from '@/components/Loader'
import Button from '@/components/Button'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Modal from '@/components/Modal'
import Header from '@/components/Header'

export default function RequestsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [selectedRequestId, setSelectedRequestId] = useState(null)

    useEffect(() => {
        if (!user || user.role !== 'seller') {
            router.push('/login')
            return
        }
        fetchRequests()
    }, [user])

    const fetchRequests = async () => {
        try {
            const response = await axios.get('/api/seller/orders')
            setRequests(response.data)
        } catch (err) {
            setError('Ошибка при загрузке заявок')
        } finally {
            setLoading(false)
        }
    }


    const handleSend = async requestId => {
        setSelectedRequestId(requestId)
        setModalMessage('Вы уверены, что отправили этот товар?')
        setShowModal(true)
    }

    const confirmSend = async () => {
        try {
            await axios.put(`/api/seller/orders/${selectedRequestId}/status`, {
                is_send: true
            })
            await fetchRequests()
            setModalMessage('Товар успешно отправлен')
            setTimeout(() => setShowModal(false), 2000)
        } catch (error) {
            setModalMessage('Ошибка при отправлении товара')
        }
    }

    if (loading) return <Loader />
    if (error) return <div className="text-center text-red-500">{error}</div>
    return (
        <>
            <Header title="Управление заявками" />
            <div className="container mx-auto px-4 py-8">
            {requests.length === 0 ? (
                <p>У вас нет заявок</p>
            ) : (
                <div className="container mx-auto p-4">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Id</th>
                                <th className="py-3 px-6 text-left">Наименование продукта</th>
                                <th className="py-3 px-6 text-left">Цена за ед.</th>
                                <th className="py-3 px-6 text-left">Кол-во</th>
                                <th className="py-3 px-6 text-left">Итоговая цена</th>
                                <th className="py-3 px-6 text-left">Адрес</th>
                                <th className="py-3 px-6 text-left">Статус</th>
                                <th className="py-3 px-6 text-left">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {requests.map(request => (
                                <tr key={request.id} className="border-b border-gray-300 hover:bg-gray-100">
                                    <td className="py-3 px-6">{request.id}</td>
                                    <td className="py-3 px-6">{request.product_name}</td>
                                    <td className="py-3 px-6">{request.price}₽</td>
                                    <td className="py-3 px-6">{request.quantity}</td>
                                    <td className="py-3 px-6">{request.total}₽</td>
                                    <td className="py-3 px-6">{request.address}</td>
                                    <td className="py-3 px-6">{request.is_send ? (<span className='text-green-600'>Отправлен</span>) : (<span className='text-red-600'>Не отправлен</span>)}</td>
                                    {!request.is_send &&
                                    (<td className="py-3 px-6">
                                        <Button
                                            onClick={() => handleSend(request.id)}>
                                            Отправить
                                        </Button>
                                    </td>)
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Подтверждение"
                onConfirm={
                    modalMessage ===
                    'Вы уверены, что отправили этот товар?'
                        ? confirmSend
                        : undefined
                }>
                <p>{modalMessage}</p>
            </Modal>
        </div>
        </>)
}

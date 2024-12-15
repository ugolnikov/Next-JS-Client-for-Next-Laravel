'use client'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Button from '@/components/Button'
import axios from '@/lib/axios'
import Loader from '@/components/Loader'

const Checkout = () => {
    const router = useRouter()
    const { user, cart, isLoading } = useAuth()

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState('')

    // Подставляем данные пользователя при загрузке
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            }))
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        // Проверка ФИО
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'ФИО обязательно для заполнения'
        }

        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен для заполнения'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Введите корректный email'
        }

        // Проверка телефона
        const phoneRegex = /^\+7\d{10}$/
        if (!formData.phone.trim()) {
            newErrors.phone = 'Номер телефона обязателен для заполнения'
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Введите корректный номер телефона в формате +7XXXXXXXXXX'
        }

        // Проверка адреса
        if (!formData.address.trim()) {
            newErrors.address = 'Адрес обязателен для заполнения'
        }

        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrors({})
        setSuccess('')

        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            setIsSubmitting(false)
            return
        }

        try {
            const response = await axios.post('/api/orders', {
                ...formData,
                items: cart.items,
            })
            
            setSuccess('Заказ успешно оформлен!')
            
            setTimeout(() => {
                router.push(`/dashboard/orders/${response.data.orders[0].order_number}`)
            }, 2000)
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: error.response?.data?.message || 'Произошла ошибка при оформлении заказа'
            }))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return <Loader />

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-6">
                <p className="text-center text-gray-600">
                    Ваша корзина пуста. Добавьте товары для оформления заказа.
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#4438ca] mb-6">
                Оформление заказа
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ФИО */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        ФИО
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                    />
                    {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                {/* Телефон */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Телефон
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+7XXXXXXXXXX"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                </div>

                {/* Адрес */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Адрес доставки
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                    />
                    {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                </div>

                {/* Итоговая сумма */}
                <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Итого:</span>
                        <span>{cart?.total || 0} ₽</span>
                    </div>
                </div>

                {/* Кнопка оформления */}
                <div className="flex flex-col items-center gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded">
                        {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
                    </Button>
                    
                    {errors.submit && (
                        <p className="text-sm text-red-600">{errors.submit}</p>
                    )}
                    {success && (
                        <p className="text-sm text-green-600">{success}</p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Checkout

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
import Loader from '@/components/Loader'
import Button from '@/components/Button'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'

const CartPage = () => {
    const { cart, mutateCart, user } = useAuth()

    const [loading, setLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    const router = useRouter()
    useEffect(() => {
        if (!user || user.role !== 'customer') {
            router.push('/login')
        }
    }, [user, router])

    useEffect(() => {
        if (cart && cart.items) {
            const total = cart.items.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0,
            )
            setTotalPrice(total)
        }
    }, [cart])

    const handleRemoveItem = async cartId => {
        setLoading(true)
        try {
            await axios.delete(`/api/cart/${cartId}`)
            mutateCart()
        } catch (error) {
            console.error('Ошибка при удалении товара из корзины', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCheckout = () => {
        console.log('Оформить заказ')
    }

    if (loading || !cart) {
        return <Loader />
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full  sm:px-10">
            {cart.items.map(item => (
                <div
                    key={item.product.id}
                    className="flex flex-col md:flex-row justify-between items-center border-b p-4 hover:bg-[#dddddd] transition duration-300">
                    <div className="w-full md:w-1/4">
                        <p className="font-semibold">Продукт:</p>
                        <p>{item.product.name}</p>
                    </div>
                    <div className="w-full md:w-1/4">
                        <p className="font-semibold">Цена:</p>
                        <p>{item.product.price}₽</p>
                    </div>
                    <div className="w-full md:w-1/4">
                        <p className="font-semibold">Количество:</p>
                        <p>{item.quantity}</p>
                    </div>
                    <div className="w-full md:w-1/4">
                        <p className="font-semibold">Сумма:</p>
                        <p>{item.product.price * item.quantity}₽</p>
                    </div>
                    <div className="w-full md:w-auto mt-4 md:mt-0">
                        <Button
                            onClick={() => handleRemoveItem(item.id)}
                            className="rounded">
                            Удалить
                        </Button>
                    </div>
                </div>
            ))}
            <div className="flex justify-between items-center mt-6 px-6 py-4 bg-[#f8f8f8]">
                <h2 className="text-xl font-bold">
                    Общая сумма: {totalPrice}₽
                </h2>
                <Button onClick={handleCheckout} className="rounded">
                    Оформить заказ
                </Button>
            </div>
        </div>
    )
}

export default CartPage

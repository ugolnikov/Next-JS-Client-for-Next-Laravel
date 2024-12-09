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
            const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
            setTotalPrice(total)
        }
    }, [cart])

    const handleRemoveItem = async (productId) => {
        setLoading(true)
        try {
            await axios.delete(`/api/cart/${productId}`)
            mutateCart() 
        } catch (error) {
            console.error('Ошибка при удалении товара из корзины', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCheckout = () => {
        console.log("Оформить заказ")
    }

    if (loading || !cart) {
        return <Loader /> 
    }
    console.log(user)
    

    return (
        <div className="container mx-auto px-4 pt-6 pb-8">
            <h1 className="text-3xl font-bold text-center text-[#4438ca] mb-8">Корзина</h1>
            {cart.items.length === 0 ? (
                <p className="text-center text-lg">Ваша корзина пуста</p>
            ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <table className="min-w-full table-auto">
                        <thead className="bg-[#4438ca] text-white">
                            <tr>
                                <th className="px-6 py-3 text-left">Продукт</th>
                                <th className="px-6 py-3 text-left">Цена</th>
                                <th className="px-6 py-3 text-left">Количество</th>
                                <th className="px-6 py-3 text-left">Сумма</th>
                                <th className="px-6 py-3 text-left">Удалить</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.items.map((item) => (
                                <tr key={item.product.id} className="border-b hover:bg-[#dddddd] transition duration-300">
                                    <td className="px-6 py-4">{item.product.name}</td>
                                    <td className="px-6 py-4">{item.product.price}₽</td>
                                    <td className="px-6 py-4">{item.quantity}</td>
                                    <td className="px-6 py-4">{item.product.price * item.quantity}₽</td>
                                    <td className="px-6 py-4">
                                        <Button
                                            onClick={() => handleRemoveItem(item.product.id)}
                                            className="rounded"
                                        >
                                            Удалить
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-6 px-6 py-4 bg-[#f8f8f8]">
                        <h2 className="text-xl font-bold">Общая сумма: {totalPrice}₽</h2>
                        <Button
                            onClick={handleCheckout}
                            className="rounded"
                        >
                            Оформить заказ
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartPage

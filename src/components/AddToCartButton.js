import { useState } from 'react'
import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'
import { useRouter } from 'next/navigation'

const AddToCartBtn = ({ productId }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false) 
    const { addToCart, user } = useAuth({ middleware: 'guest' }) 
    const router = useRouter()

    const handleClick = async () => {
        setLoading(true)
        setError(null)

        if (!user) {
            router.push('/login')
            return
        }

        try {
            await addToCart(productId, 1)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 1500)
        } catch (error) {
            setError('Ошибка при добавлении в корзину')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Button
                onClick={handleClick}
                disabled={loading}
                className={`rounded ${success ? 'bg-green-500 hover:bg-green-500' : ''} transition-colors duration-300`}>
                {loading ? 'Добавление...' : success ? 'Добавлено!' : 'Добавить в корзину'}
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}

export default AddToCartBtn

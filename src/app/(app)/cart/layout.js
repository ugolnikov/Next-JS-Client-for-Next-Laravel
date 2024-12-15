'use client'
import { useAuth } from '@/hooks/auth'
import Loader from '@/components/Loader'

const CartLayout = ({ children }) => {
    const { user, isLoading } = useAuth({ middleware: 'auth' })

    if (isLoading) {
        return <Loader />
    }

    if (!user) {
        return null
    }

    return <div className="min-h-[calc(100vh-64px-200px)] bg-gray-100">{children}</div>
}

export default CartLayout

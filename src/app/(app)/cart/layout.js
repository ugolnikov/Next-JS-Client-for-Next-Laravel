'use client'
import { useAuth } from '@/hooks/auth'
import Loader from '@/components/Loader'

const CartLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })
    if (!user) {
        return <Loader />
    }
    return (
        <div>
            {children}
        </div>
    )
}

export default CartLayout

'use client'
import { useAuth } from '@/hooks/auth'
import Loader from '@/components/Loader'

const DashboardLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })
    if (!user) {
        return <Loader />
    }
    return (
        <div className="min-h-screen bg-gray-100">
            {children}
        </div>
    )
}

export default DashboardLayout

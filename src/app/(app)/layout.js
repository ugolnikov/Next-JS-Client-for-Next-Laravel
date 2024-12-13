'use client'
import { useAuth } from '@/hooks/auth'
import Navigation from '@/components/Navigation'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'guest' })
    return (
            <div className="min-h-screen bg-gray-100">
                <Navigation user={user} />
                <main>{children}</main>
            </div>
    )
}

export default AppLayout

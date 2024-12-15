'use client'
import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import ApplicationLogo from '@/components/ApplicationLogo'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/hooks/auth'
import Loader from '@/components/Loader'


const Layout = ({ children }) => {
    const { user, isLoading } = useAuth({ middleware: 'guest' })
    if (isLoading) {
        return <Loader />
    }
    return (
        <main>
            <Navigation user={user} />
            <div className="text-gray-900 antialiased">
                <AuthCard
                    logo={
                        <Link href="/">
                            <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                        </Link>
                    }>
                    {children}
                </AuthCard>
            </div>
        </main>
    )
}

export default Layout

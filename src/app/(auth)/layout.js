'use client'
import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import ApplicationLogo from '@/components/ApplicationLogo'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/hooks/auth'


const Layout = ({ children }) => {
    const { user } = useAuth({ middleware: 'guest' })
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

'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import NavLink from '@/components/NavLink'
import { usePathname } from 'next/navigation'

const LoginLinks = () => {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        // <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex h-full">
        //     <NavLink href="/" active={usePathname() === '/'}>
        //         Товары
        //     </NavLink>
        //     <NavLink href="/dashboard" active={usePathname() === '/dashboard'}>
        //         Личный кабинет
        //     </NavLink>
        // </div>

        
        // <div className="hidden fixed top-0 right-0 px-6 py-4 sm:flex h-fit w-[15%] justify-evenly">
        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex h-full">
            {user ? (
                <Link
                    href="/dashboard" 
                    className="ml-4 text-sm text-gray-700 underline"
                >
                    Личный кабинет
                </Link>
            ) : (
                <>
                    <NavLink
                        href="/login" active={usePathname() === '/login'}
                        className="me-2 text-sm text-gray-700 underline"
                    >
                        Вход
                    </NavLink>

                    <NavLink
                        href="/register" active={usePathname() === '/register'}
                        className="ml-5 text-sm text-gray-700 underline"
                    >
                        Регистрация
                    </NavLink>
                </>
            )}
        </div>
    )
}

export default LoginLinks

'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import NavLink from '@/components/NavLink'

const LoginLinks = () => {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <div className="hidden fixed top-0 right-0 px-6 py-4 sm:flex h-fit w-[15%] justify-evenly">
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
                        href="/login"
                        className="me-2 text-sm text-gray-700 underline"
                    >
                        Вход
                    </NavLink>

                    <NavLink
                        href="/register"
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

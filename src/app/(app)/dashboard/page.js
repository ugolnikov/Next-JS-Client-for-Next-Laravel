'use client'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'

const Dashboard = () => {
    const { user, mutate } = useAuth()
    const router = useRouter()
    const changeRole = async ({ url }) => {
        try {
            await axios.post(url)
            mutate()
        } catch (error) {
            console.error('Ошибка при смене роли:', error)
        }
    }

    return (
        <>
            <Header title="Личный кабинет" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-3xl font-bold text-[#4438ca]">
                                Добро пожаловать, {user?.name}!
                            </h2>
                            <p className="mt-4 text-lg text-gray-700">
                                Ваш email: {user?.email}
                            </p>
                            <p className="mt-4 text-lg text-gray-700">
                                Роль:
                                {user?.role === 'seller' ? (
                                    <>
                                        <span className="text-[#4438ca]">
                                            {'  '}Продавец -{'  '}
                                        </span>
                                        <Button
                                            className="text-sm rounded !p-1"
                                            onClick={() =>
                                                changeRole({
                                                    url: '/api/change_role/customer',
                                                })
                                            }>
                                            Стать покупателем
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-[#4438ca]">
                                            {'  '}Покупатель -{'  '}
                                        </span>
                                        <Button
                                            className="text-sm rounded !p-1"
                                            onClick={() =>
                                                changeRole({
                                                    url: '/api/change_role/seller',
                                                })
                                            }>
                                            Стать продавцом
                                        </Button>
                                    </>
                                )}
                            </p>
                            {user?.role === 'seller' ? (
                                <div className="mt-4 text-lg text-gray-700">
                                    Статус подтверждения:
                                    {user?.is_verify ? (
                                        <span className="text-green-600">
                                            {'  '}ОК{'  '}
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-red-600">
                                                {'  '}не подтвержденная{'  '}
                                            </span>
                                            <div className="mt-2">
                                                <Button
                                                    className="text-sm rounded !p-2"
                                                    onClick={() =>
                                                        router.push(
                                                            '/dashboard/confirmation',
                                                        )
                                                    }>
                                                    Подтвердить
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : null}

                            {user?.role === 'seller' && (
                                <div className="mt-8 p-6 bg-gray-50 border rounded-lg shadow-lg">
                                    <h3 className="text-2xl font-semibold text-[#4438ca] mb-4">
                                        Реквизиты компании
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col">
                                            <p className="font-medium text-gray-700">
                                                Компания:
                                            </p>
                                            <p className="text-lg text-gray-900">
                                                {user?.company_name
                                                    ? user.company_name
                                                    : 'отсутствует'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-medium text-gray-700">
                                                ИНН:
                                            </p>
                                            <p className="text-lg text-gray-900">
                                                {user?.inn
                                                    ? user.inn
                                                    : 'отсутствует'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-medium text-gray-700">
                                                Адрес:
                                            </p>
                                            <p className="text-lg text-gray-900">
                                                {user?.address
                                                    ? user.address
                                                    : 'отсутствует'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-medium text-gray-700">
                                                Телефон:
                                            </p>
                                            <p className="text-lg text-gray-900">
                                                {user?.phone
                                                    ? user.phone
                                                    : 'отсутствует'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6 text-center">
                                        {user?.logo ? (
                                            <img
                                                src={user.logo}
                                                alt="Логотип компании"
                                                className="w-40 h-40 object-cover rounded-lg shadow-md mx-auto"
                                            />
                                        ) : (
                                            <p className="w-40 h-40 object-cover rounded-lg shadow-md mx-auto flex justify-center items-center">
                                                Логотип
                                                <br /> отсутствует
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-3xl font-bold text-[#4438ca]">
                                Ваши заказы:
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard

'use client'
import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'



const Dashboard = () => {
    const { user } = useAuth()
    return (
        <>
            <Header title="Личный кабинет" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                        <h2 className="text-3xl font-bold text-[#4438ca]">Добро пожаловать, {user?.name}!</h2>
                            <p className="mt-4 text-lg text-gray-700">Ваш email: {user?.email}</p>
                            <p className="mt-2 text-lg text-gray-700">Роль: {user?.role === 'seller' ? 'Продавец' : 'Покупатель'}</p>


                            {user?.role === 'seller' && (
                                <div className="mt-8 p-6 bg-gray-50 border rounded-lg shadow-lg">
                                    <h3 className="text-2xl font-semibold text-[#4438ca] mb-4">Реквизиты компании</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col">
                                            <p className="font-medium text-gray-700">Компания:</p>
                                            <p className="text-lg text-gray-900">{user.company_name}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-medium text-gray-700">ИНН:</p>
                                            <p className="text-lg text-gray-900">{user.inn}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-medium text-gray-700">Адрес:</p>
                                            <p className="text-lg text-gray-900">{user.address}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-medium text-gray-700">Телефон:</p>
                                            <p className="text-lg text-gray-900">{user.phone}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 text-center">
                                        <img src={user.logo} alt="Логотип компании" className="w-40 h-40 object-cover rounded-lg shadow-md mx-auto" />
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard

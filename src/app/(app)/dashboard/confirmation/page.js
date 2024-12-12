'use client'
import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'
import axios from '@/lib/axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/Input'

const ProfileConfirmation = () => {
    const { user, mutate } = useAuth()
    const [profile, setProfile] = useState({
        companyName: user?.company_name || '',
        inn: user?.inn || '',
        address: user?.address || '',
        phone: user?.phone || '',
        logo: user?.logo || '',
    })
    const [innGood, setinnGood] = useState(false)
    const [innError, setInnError] = useState(false)
    const [isProfileConfirmed, setProfileConfirmed] = useState(false)
    const [logoFile, setLogoFile] = useState(null)
    const router = useRouter()

    useEffect(() => {
        if (user?.is_verify) {
            setProfileConfirmed(true)
        }
    }, [user])

    const handleINN = async () => {
        try {
            const response = await axios.post('/api/validate/inn', {
                inn: profile.inn,
            })
            if (!response.data[0]) {
                alert('ИНН неверный или не существует.')
                setInnError(true)
                return false
            }
            setinnGood(true)
            setProfile(prevProfile => ({
                ...prevProfile,
                address: response.data[0].data.address.value || '',
            }));
            return true
        } catch (error) {
            console.log('Ошибка при проверке ИНН:', error)
            setInnError(true);
            return false
        }
    }

    const handleLogoChange = event => {
        const file = event.target.files[0]
        if (file) {
            setLogoFile(file)
        }
    }

    const handleLogoUpload = async () => {
        if (!logoFile) {
            alert('Пожалуйста, выберите файл для загрузки.')
            return
        }

        const formData = new FormData()
        formData.append('logo', logoFile)

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload/logo`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            setProfile(prevProfile => ({
                ...prevProfile,
                logo: process.env.NEXT_PUBLIC_API_URL + response.data.logoUrl,
            }))
        } catch (error) {
            console.error('Ошибка при загрузке логотипа:', error)
            alert('Не удалось загрузить логотип.')
        }
    }

    const handleConfirmProfile = async () => {
        const isValidINN = await handleINN()
        if (!isValidINN) return (alert('ИНН является неправильным!'))

        try {
            const response = await axios.post('/api/validate/seller', {
                ...profile,
            })
            mutate()
            setProfileConfirmed(true)
            router.push('/dashboard')
        } catch (error) {
            console.error('Ошибка при подтверждении профиля:', error)
        }
    }

    const handleInputChange = field => event => {
        setProfile(prevProfile => ({
            ...prevProfile,
            [field]: event.target.value || '',
        }))
    }

    return (
        <>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-3xl font-bold text-[#4438ca]">
                                Подтверждение профиля
                            </h2>
                            <p className="mt-4 text-lg text-gray-700">
                                Для завершения регистрации и подтверждения
                                профиля заполните все поля.
                            </p>

                            <div className="mt-8 p-6 bg-gray-50 border rounded-lg shadow-lg">
                                <h3 className="text-2xl font-semibold text-[#4438ca] mb-4">
                                    Реквизиты компании
                                </h3>

                                {/* Company Name Input */}
                                <div className="flex flex-col my-5">
                                    <p className="font-medium text-gray-700">
                                        Компания:
                                    </p>
                                    <Input
                                        value={profile.companyName}
                                        onChange={handleInputChange(
                                            'companyName',
                                        )}
                                        placeholder="Введите название компании"
                                    />
                                </div>

                                {/* INN Input */}
                                <div className="flex flex-col my-5">
                                    <p className="font-medium text-gray-700">
                                        ИНН:
                                    </p>
                                    <div className="flex flex-row w-full">
                                        <Input
                                            value={profile.inn}
                                            onChange={handleInputChange('inn')}
                                            placeholder="Введите ИНН"
                                            className={`w-[80%] ${innError ? 'border-red-500' : ''}
                                                                ${innGood ? 'border-green-500' : ''}`}
                                            required
                                        />
                                        <Button onClick={handleINN} className="w-[20%] rounded">
                                            Проверить
                                        </Button>
                                    </div>
                                </div>

                                {/* Address Input */}
                                <div className="flex flex-col my-5">
                                    <p className="font-medium text-gray-700">
                                        Адрес:
                                    </p>
                                    <Input
                                        value={profile.address}
                                        onChange={handleInputChange('address')}
                                        placeholder="Введите адрес"
                                    />
                                </div>

                                {/* Phone Input */}
                                <div className="flex flex-col my-5">
                                    <p className="font-medium text-gray-700">
                                        Телефон:
                                    </p>
                                    <Input
                                        value={profile.phone}
                                        onChange={handleInputChange('phone')}
                                        placeholder="Введите телефон"
                                    />
                                </div>

                                {/* Logo Upload Section */}
                                <div className="mt-6 text-center flex flex-row">
                                    <div>{profile.logo ? (
                                        <img
                                            src={profile.logo}
                                            alt="Логотип компании"
                                            className="w-40 h-40 object-cover rounded-lg shadow-md border-4"
                                        />
                                    ) : (
                                        <p className="w-40 h-40 object-cover rounded-lg shadow-md border-4 flex justify-center items-center">
                                            Логотип
                                            <br /> отсутствует
                                        </p>
                                    )}</div>
                                    <div className='flex flex-col ml-10'>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="mt-4"
                                    />
                                    <Button
                                        onClick={handleLogoUpload}
                                        className="mt-2">
                                        Загрузить логотип
                                    </Button>
                                    </div>
                                    
                                </div>
                            </div>

                            {/* Confirm Profile Button */}
                            {!isProfileConfirmed && (
                                <div className="mt-6 text-center">
                                    <Button
                                        className="text-sm rounded !p-2"
                                        onClick={handleConfirmProfile}>
                                        Подтвердить профиль
                                    </Button>
                                </div>
                            )}

                            {/* Profile Confirmation Message */}
                            {isProfileConfirmed && (
                                <div className="mt-6 text-center">
                                    <span className="text-green-600">
                                        Профиль подтвержден!
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileConfirmation

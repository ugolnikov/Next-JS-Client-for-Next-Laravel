'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import Button from '@/components/Button'
import Image from 'next/image'

const ProfileConfirmation = () => {
    const router = useRouter()
    const { user, mutate } = useAuth({ middleware: 'auth' })
    const [logoFile, setLogoFile] = useState(null)
    const [profile, setProfile] = useState({
        company_name: user?.company_name || '',
        inn: user?.inn || '',
        address: user?.address || '',
        phone: user?.phone || '',
        logo: user?.logo || '',
    })

    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [logoError, setLogoError] = useState('')
    const [logoSuccess, setLogoSuccess] = useState('')
    const [isINNVerified, setIsINNVerified] = useState(false)
    const [isCheckingINN, setIsCheckingINN] = useState(false)
    const [isLogoUploaded, setIsLogoUploaded] = useState(!!user?.logo)

    const handleChange = e => {
        const { name, value } = e.target
        setProfile(prev => ({
            ...prev,
            [name]: value,
        }))
        // Очищаем ошибку для поля при его изменении
        setErrors(prev => ({
            ...prev,
            [name]: '',
        }))
    }

    const handleLogoChange = event => {
        const file = event.target.files[0]
        if (file) {
            // Проверка размера файла (например, не более 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setLogoError('Размер файла не должен превышать 5MB')
                return
            }
            // Проверка типа файла
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setLogoError('Допускаются только изображения в формате JPEG или PNG')
                return
            }
            setLogoFile(file)
            setLogoError('')
        }
    }

    const handleLogoUpload = async () => {
        if (!logoFile) {
            setLogoError('Пожалуйста, выберите файл для загрузки')
            return
        }

        try {
            setIsSubmitting(true)
            const formData = new FormData()
            formData.append('logo', logoFile)

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
            setLogoSuccess('Логотип успешно загружен')
            setLogoError('')
            setIsLogoUploaded(true)
            setTimeout(() => setLogoSuccess(''), 3000)
        } catch (error) {
            setLogoError(
                error.response?.data?.message ||
                    'Произошла ошибка при загрузке логотипа',
            )
            setIsLogoUploaded(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleINNCheck = async () => {
        setIsCheckingINN(true)
        setErrors(prev => ({ ...prev, inn: '' }))

        try {
            const response = await axios.post('/api/validate/inn', {
                inn: profile.inn,
            })
            setProfile(prev => ({
                ...prev,
                address: response.data[0].data.address.value || prev.address,
            }))
            
            setIsINNVerified(true)
            setSuccess('ИНН успешно проверен')
            setTimeout(() => setSuccess(''), 3000)
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                inn: 'Неверный ИНН или ошибка проверки',
            }))
            setIsINNVerified(false)
        } finally {
            setIsCheckingINN(false)
        }
    }

    const handleConfirmProfile = async () => {
        setIsSubmitting(true)
        setErrors({})
        setSuccess('')

        try {
            if (!isINNVerified || !isLogoUploaded) {
                if (!isINNVerified) {
                    setErrors(prev => ({
                        ...prev,
                        inn: 'Необходимо проверить ИНН перед отправкой формы',
                    }))
                }
                if (!isLogoUploaded) {
                    setLogoError('Необходимо загрузить логотип перед отправкой формы')
                }
                setIsSubmitting(false)
                return
            }

            const formData = {
                companyName: profile.company_name,
                inn: profile.inn,
                address: profile.address,
                phone: profile.phone,
                logo: profile.logo,
            }

            await axios.post('/api/validate/seller', formData)
            
            await mutate()
            setSuccess('Профиль успешно подтвержден')
            
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        } catch (error) {
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.messages || 
                               'Произошла ошибка при подтверждении профиля'
            setErrors(prev => ({
                ...prev,
                submit: errorMessage
            }))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#4438ca] mb-6">
                Подтверждение профиля продавца
            </h2>

            <div className="space-y-6">
                {/* Поля формы */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Название компании
                    </label>
                    <input
                        type="text"
                        name="company_name"
                        value={profile.company_name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                    />
                    {errors.company_name && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.company_name}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        ИНН
                    </label>
                    <div className="mt-1 flex gap-4">
                        <input
                            type="text"
                            name="inn"
                            value={profile.inn}
                            onChange={e => {
                                handleChange(e)
                                setIsINNVerified(false) // Сбрасываем верификацию при изменении ИНН
                            }}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                        />
                        <Button
                            onClick={handleINNCheck}
                            disabled={!profile.inn || isCheckingINN}
                            className="whitespace-nowrap rounded">
                            {isCheckingINN ? 'Проверка...' : 'Проверить ИНН'}
                        </Button>
                    </div>
                    {errors.inn && (
                        <p className="mt-1 text-sm text-red-600">{errors.inn}</p>
                    )}
                    {isINNVerified && (
                        <p className="mt-1 text-sm text-green-600">
                            ИНН успешно проверен
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Адрес
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                    />
                    {errors.address && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.address}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Телефон
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="+7XXXXXXXXXX"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.phone}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Логотип компании {!isLogoUploaded && <span className="text-red-500">*</span>}
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                        <input
                            type="file"
                            onChange={handleLogoChange}
                            accept="image/jpeg,image/png"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#4438ca] file:text-white hover:file:bg-[#19144d]"
                        />
                        <Button
                            onClick={handleLogoUpload}
                            disabled={!logoFile || isSubmitting}
                            className="rounded">
                            {isSubmitting ? 'Загрузка...' : 'Загрузить'}
                        </Button>
                    </div>
                    {logoError && (
                        <p className="mt-1 text-sm text-red-600">{logoError}</p>
                    )}
                    {logoSuccess && (
                        <p className="mt-1 text-sm text-green-600">
                            {logoSuccess}
                        </p>
                    )}
                    {profile.logo && (
                        <div className="mt-4">
                            <Image
                                src={profile.logo}
                                alt="Логотип компании"
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Кнопка подтверждения */}
                <div className="flex flex-col items-center gap-4 mt-6">
                    <Button
                        onClick={handleConfirmProfile}
                        disabled={isSubmitting || !isINNVerified || !isLogoUploaded}
                        className={`w-full rounded ${
                            (!isINNVerified || !isLogoUploaded) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}>
                        {isSubmitting
                            ? 'Обработка...'
                            : 'Подтвердить профиль'}
                    </Button>
                    
                    {(!isINNVerified || !isLogoUploaded) && (
                        <p className="text-sm text-yellow-600">
                            Для подтверждения профиля необходимо:
                            {!isINNVerified && <span className="block">- Проверить ИНН</span>}
                            {!isLogoUploaded && <span className="block">- Загрузить логотип</span>}
                        </p>
                    )}
                    
                    {errors.submit && (
                        <p className="text-sm text-red-600">{errors.submit}</p>
                    )}
                    {success && (
                        <p className="text-sm text-green-600">{success}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileConfirmation

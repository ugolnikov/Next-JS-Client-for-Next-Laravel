import { useState, useEffect } from 'react'
import Button from './Button'
import Image from 'next/image'
import axios from 'axios'

export default function ProductForm({ initialData, onSubmit, isLoading }) {
    const getCsrfToken = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`)
    }
    axios.defaults.withCredentials = true
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        full_description: '',
        unit: 'штука',
        image_preview: null,
        images: [],
        ...initialData
    })
    const [previewImages, setPreviewImages] = useState([])
    const [previewMainImage, setPreviewMainImage] = useState(null)
    const [errors, setErrors] = useState({})
    const [setIsSubmitting] = useState(false)

    useEffect(() => {
        if (initialData?.images) {
            try {
                const parsedImages = JSON.parse(initialData.images)
                setPreviewImages(parsedImages)
            } catch (e) {
                throw new Error('Ошибка парсинга изображений:', e)
            }
        }
        if (initialData?.image_preview) {
            setPreviewMainImage(initialData.image_preview)
        }
    }, [initialData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setErrors(prev => ({
            ...prev,
            [name]: undefined
        }))
    }

    const handleMainImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    image_preview: 'Размер файла не должен превышать 5MB',
                }))
                return
            }
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                setErrors((prev) => ({
                    ...prev,
                    image_preview: 'Допускаются только изображения JPEG или PNG',
                }))
                return
            }
            uploadImage(file, 'main')
        }
    }

    const handleAdditionalImagesChange = (event) => {
        const files = Array.from(event.target.files)
        const validFiles = files.filter(
            (file) =>
                file.size <= 5 * 1024 * 1024 &&
                ['image/jpeg', 'image/png'].includes(file.type),
        )
        if (validFiles.length === 0) {
            setErrors((prev) => ({
                ...prev,
                images: 'Добавьте файлы JPEG или PNG размером до 5MB',
            }))
            return
        }
        validFiles.forEach((file) => uploadImage(file, 'additional'))
    }

    const uploadImage = async (file, type) => {
        try {
            await getCsrfToken()
            setIsSubmitting(true)
            const formData = new FormData()
            formData.append('image', file)

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload/image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )

            if (type === 'main') {
                setPreviewMainImage(process.env.NEXT_PUBLIC_API_URL + response.data.imageUrl)
                setFormData((prev) => ({
                    ...prev,
                    image_preview: process.env.NEXT_PUBLIC_API_URL + response.data.imageUrl,
                }))
            } else if (type === 'additional') {
                setPreviewImages((prev) => [...prev, process.env.NEXT_PUBLIC_API_URL + response.data.imageUrl])
                setFormData((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), process.env.NEXT_PUBLIC_API_URL + response.data.imageUrl],
                }))
            }
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                [type === 'main' ? 'image_preview' : 'images']:
                    'Произошла ошибка при загрузке изображения',
            }))
            throw new Error('Ошибка загрузки изображения:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const removeImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index))
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = {}

        if (!formData.name) validationErrors.name = 'Введите название товара'
        if (!formData.price) validationErrors.price = 'Введите цену'
        if (!formData.description) validationErrors.description = 'Введите краткое описан��е'
        if (!formData.full_description) validationErrors.full_description = 'Введите полное описание'
        if (previewImages.length === 0) validationErrors.images = 'Добавьте хотя бы одно изображение'

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Название товара</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setErrors(prev => ({ ...prev, name: undefined }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Цена</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onFocus={() => setErrors(prev => ({ ...prev, price: undefined }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Единица измерения</label>
                <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]">
                    <option value="штука">штука</option>
                    <option value="упаковка">упаковка</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Краткое описание</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onFocus={() => setErrors(prev => ({ ...prev, description: undefined }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Полное описание</label>
                <textarea
                    name="full_description"
                    value={formData.full_description}
                    onChange={handleChange}
                    onFocus={() => setErrors(prev => ({ ...prev, full_description: undefined }))}
                    rows={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4438ca] focus:ring-[#4438ca]"
                />
                {errors.full_description && <p className="mt-1 text-sm text-red-600">{errors.full_description}</p>}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Главное изображение товара
                    </label>
                    <div className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                        />
                        {previewMainImage ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={previewMainImage}
                                    alt="Главное изображение"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewMainImage(null)
                                        setFormData(prev => ({ ...prev, image_preview: null }))
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600">
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="mt-2 text-gray-500">Нажмите для загрузки главного изображения</span>
                            </div>
                        )}
                    </div>
                    {errors.image_preview && (
                        <p className="mt-1 text-sm text-red-600">{errors.image_preview}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Дополнительные изображения
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        {previewImages.map((image, index) => (
                            <div key={index} className="relative aspect-square">
                                <Image
                                    src={image}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    sizes='(max-width: 768px)'
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600">
                                    ✕
                                </button>
                            </div>
                        ))}
                        <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleAdditionalImagesChange}
                                className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center h-full">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="mt-2 text-xs text-gray-500 text-center">Добавить фото</span>
                            </div>
                        </div>
                    </div>
                    {errors.images && (
                        <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded">
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </div>
        </form>
    )
} 
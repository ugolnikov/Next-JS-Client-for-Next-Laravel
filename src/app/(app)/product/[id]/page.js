'use client'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useState, useEffect } from 'react'
import Loader from '@/components/Loader'
import ImageWithLoader from '@/components/ImageWithLoader'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import CheckMark from '@/components/CheckMark'
import Button from '@/components/Button'
import { useRouter } from 'next/navigation'
import AddToCart from '@/components/AddToCartButton'

const loadProduct = async id => {
    const url = `/api/products/${id}`
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        if (error.response?.status === 404) {
            return null
        }
        throw error
    }
}

export default function Page({ params }) {
    const router = useRouter()
    const [id, setId] = useState(null)
    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        const fetchId = async () => {
            const resolvedParams = await params
            if (resolvedParams?.id) {
                setId(resolvedParams.id)
            }
        }

        fetchId()
    }, [params])

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return
            try {
                setIsLoading(true)
                setIsError(false)
                setNotFound(false)
                const data = await loadProduct(id)
                if (data === null) {
                    setNotFound(true)
                } else {
                    setProduct(data)
                }
            } catch (error) {
                setIsError(true)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    if (isLoading) return <Loader />
    if (notFound)
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-3xl font-bold mb-4">Товар не найден</h1>
                <p className="text-gray-600">
                    К сожалению, запрашиваемый товар не существует.
                </p>
            </div>
        )
    if (isError) return <p>Ошибка загрузки товара</p>
    if (!product) return <p>Товар не найден</p>
    const images = JSON.parse(product.data.images || '[]')

    return (
        <div>
            <Button
                className="ml-10 mt-5 text-md rounded"
                onClick={() => router.back()}>
                <svg
                    fill='white'
                    className='w-5 h-5 mr-5'
                    version="1.1"
                    id="Layer_1"
                    viewBox="0 0 476.213 476.213">
                    <polygon
                        points="476.213,223.107 57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 
	57.427,253.107 476.213,253.107 "
                    />
                </svg>
                Назад
            </Button>
            <div className="container mx-auto px-4 pt-4 pb-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2">
                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={30}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                className="h-[500px] w-full rounded-lg">
                                {Array.isArray(images) &&
                                    images.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="flex items-center justify-center h-full bg-gray-50">
                                                <ImageWithLoader
                                                    src={image}
                                                    alt={`Изображение ${index + 1}`}
                                                    width={400}
                                                    height={400}
                                                    className="object-contain"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                            </Swiper>
                        </div>

                        <div className="md:w-1/2 p-8">
                            <div className="space-y-6">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {product.data.name}
                                </h1>

                                <div className="border-t border-b py-4">
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-bold text-[#4438ca]">
                                            {product.data.price}₽
                                        </span>
                                        <span className="ml-2 text-gray-500">
                                            / {product.data.unit}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <AddToCart productId={id}/>
                                    <h2 className="text-xl font-semibold my-2 mt-5">
                                        Описание:
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.data.full_description}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-4">
                                        Информация о продавце
                                    </h2>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-md">
                                                <ImageWithLoader
                                                    src={
                                                        product.data.seller.logo
                                                    }
                                                    alt={
                                                        product.data.seller
                                                            .company_name
                                                    }
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-medium text-gray-900">
                                                {
                                                    product.data.seller
                                                        .company_name
                                                }
                                            </h3>
                                            <div className="mt-1 flex items-center">
                                                <span className="text-sm text-gray-500">
                                                    Официальный продавец
                                                </span>
                                                <CheckMark />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'
import useSWR from 'swr'
import axios from '@/lib/axios'
import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'


const loadProduct = async (slug) => {
    const url = `/api/products/${slug}`
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        throw error
    }
}

const OneProduct = () => {
    const router = useRouter() 
    const [slug, setSlug] = useState(null)  


    useEffect(() => {
        if (router.isReady && router.query.slug) { 
            setSlug(router.query.slug)  
        }
    }, [router.isReady, router.query.slug])  

    if (!slug) return <p>Загрузка...</p>

    const { data: product, error, isLoading } = useSWR(
        slug ? `/api/products/${slug}` : null, 
        loadProduct
    )

    if (isLoading) return <Loader />
    if (error) return <p>Ошибка загрузки товара</p>
    if (!product) return <p>Товар не найден</p>

    return (
        <div className="product-detail">
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Цена: {product.price}₽</p>
            <Image src={product.image_preview} alt={product.name} width={300} height={300} />
        </div>
    )
}

export default OneProduct

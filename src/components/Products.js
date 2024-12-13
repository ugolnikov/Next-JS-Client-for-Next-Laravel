'use client'
import axios from '@/lib/axios'
import useSWR from 'swr'
import Loader from '@/components/Loader'
import { useState, useEffect } from 'react'
import Search from '@/components/Search'
import ImageWithLoader from './ImageWithLoader'
import AddToCart from '@/components/AddToCartButton'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import AddToCartBtn from '@/components/AddToCartButton'

const loadProducts = ({ sellerId, searchQuery, page = 1 } = {}) => {
    const url = `/api/products?${sellerId ? `seller_id=${sellerId}&` : ''}${
        searchQuery ? `search=${searchQuery}&` : ''
    }page=${page}`

    const {
        data: products,
        error,
        mutate,
    } = useSWR(url, () =>
        axios
            .get(url)
            .then(res => res.data)
            .catch(err => {
                throw err
            }),
            {keepPreviousData: true}

    )
    const refreshProducts = () => mutate()
    return {
        products,
        isLoading: !products && !error,
        isError: error,
        refreshProducts,
    }
}

const ProductList = () => {
    const router = useRouter();
    const [page, setPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [submitQuery, setSubmitQuery] = useState('')
    const { products, isLoading, isError, refreshProducts } = loadProducts({
        searchQuery: submitQuery,
        page,
    })
    

    const handleSearch = () => {
        setSubmitQuery(searchQuery)
        setPage(1)
    }
    const handlePageChange = event => {
        const selectedPage = parseInt(event.target.value)
        setPage(selectedPage)
    }
    const handleClick = (productId) => {
        router.push(`/product/${productId}`)
    }
    useEffect(() => {
        if (products && products.data.length === 0 && page > 1) {
            setPage(1)
        }
    }, [products, page])

    return (
        <>
            {/* Поиск */}
            <Search
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
            />

            {/* Список товаров */}
            {isLoading ? (
                <Loader />
            ) : isError ? (
                <h1 className="text-3xl w-full h-[70%] flex items-center justify-center">
                    Ошибка загрузки товаров!
                </h1>
            ) : !products || products?.data.length === 0 ? (
                <h1 className="text-3xl w-full h-[70%] flex items-center justify-center">
                    Ничего не найдено
                </h1>
            ) : (
                // <ul className="flex flex-wrap">
                <ul className='grid grid-cols-1 2sm:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                    {products?.data.map(product => (
                        <li
                            key={product.id}
                            onClick={() => handleClick(product.id)}
                            className="border p-4 m-4 cursor-pointer hover:border-[#4438ca] rounded">
                            <ImageWithLoader
                                src={product.image_preview}
                                width={150}
                                height={150}
                                alt={product.name}
                                className="w-[100%]"
                            />
                            <div className="flex flex-col mt-2">
                                <h2 className="whitespace-nowrap text-ellipsis overflow-hidden text-xl">
                                    {product.name}
                                </h2>
                                <p className="text-[#4438ca] text-xl font-medium">
                                    Цена: {product.price}₽
                                </p>
                                <p>
                                    - {product.short_description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Пагинация */}
            <div className="flex justify-center mt-5">
                <Button
                    onClick={() =>
                        setPage(prevPage => Math.max(prevPage - 1, 1))
                    }
                    disabled={page === 1}
                    className="px-4 py-2 text-xs rounded-l">
                    Назад
                </Button>

                <select
                    value={page}
                    onChange={handlePageChange}
                    className=" border">
                    {[...Array(products?.last_page)].map((_, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>

                <Button
                    onClick={() => setPage(prevPage => prevPage + 1)}
                    disabled={page === products?.last_page}
                    className="px-4 py-2 text-xs rounded-r">
                    Вперед
                </Button>
            </div>

            {/* Показ текущей страницы */}
            <p className="text-center mt-3">
                Страница {page} из {products?.last_page}
            </p>
        </>
    )
}

export default ProductList

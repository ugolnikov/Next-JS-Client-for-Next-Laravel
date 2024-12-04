'use client'
import axios from "@/lib/axios"
import useSWR from "swr"
import Loading from "@/components/Loading"
import Image from "next/image"
import { useState } from "react"

const loadProducts = ({ sellerId, searchQuery, page = 1 } = {}) => {
    const url = `/api/products?{sellerId || searchQuery ? '?' : ''}${
        sellerId ? `seller_id=${sellerId}` : ''
    }${searchQuery ? `&search=${searchQuery}` : ''}${page ? `&page=${page}` : ''}`;

    const { data: products, error, mutate } = useSWR(url, () =>
        axios.get(url)
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    )
    return {
        products,
        isLoading: !products && !error, 
        isError: error, 
        refreshProducts: mutate, 
    }
}
const ProductList = () => {
    const [page, setPage] = useState(1); // Состояние для текущей страницы
    const { products, isLoading, isError, refreshProducts } = loadProducts({ page });
    if (isLoading) return <Loading/>
    if (isError) return <p>Ошибка загрузки товаров!</p>
    return (
        <>
            <ul className="flex flex-wrap">
                {products.data.map((product) => (
                    <li key={product.id} className="border w-[50%] sm:w-[25%] p-5">
                        <Image
                        src={product.image_preview}
                        width={150}
                        height={150}
                        alt={product.name}
                        className="w-[100%]"
                        />
                        <div className="flex flex-col">
                            <h2 className="whitespace-nowrap text-ellipsis overflow-hidden">{product.name}</h2>
                            <p className="text-[#4438ca]">Цена: {product.price}₽</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center mt-5">
            <button
                onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-[#4438ca] text-white rounded-l"
            >
                Назад
            </button>
            <button
                onClick={() => setPage(prevPage => prevPage + 1)}
                disabled={page === products?.last_page}
                className="px-4 py-2 bg-[#4438ca] text-white rounded-r"
            >
                Вперед
            </button>
        </div>

        {/* Показ текущей страницы */}
        <p className="text-center mt-3">Страница {page} из {products?.last_page}</p>
        </>
    )
}

export default ProductList

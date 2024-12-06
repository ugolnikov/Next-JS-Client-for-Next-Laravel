'use client'
import axios from "@/lib/axios"
import useSWR from "swr"
import Loading from "@/components/Loading"
import Loader from "@/components/Loader"
import Image from "next/image"
import { useState, useEffect } from "react"



const loadProducts = ({ sellerId, searchQuery, page = 1 } = {}) => {
    const url = `/api/products?${
        sellerId ? `seller_id=${sellerId}&` : ''
    }${
        searchQuery ? `search=${searchQuery}&` : ''
    }page=${page}`;

    const { data: products, error, mutate } = useSWR(url, () =>
        axios.get(url)
            .then(res => res.data)
            .catch(err => {
                throw err
            })
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
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [submitQuery, setSubmitQuery] = useState("");
    const { products, isLoading, isError, refreshProducts } = loadProducts({ searchQuery: submitQuery, page });

    const handleSearch = () => {
        setSubmitQuery(searchQuery)
        setPage(1)
    }
    const handlePageChange = (event) => {
        const selectedPage = parseInt(event.target.value);
        setPage(selectedPage);
    };
    useEffect(() => {
        if (products && products.data.length === 0 && page > 1) {
            setPage(1);
        }
    }, [products, page]);

    if (isLoading) return <Loader />
    if (isError) return <p>Ошибка загрузки товаров!</p>

    return (
        <>
            {/* Кнопка обновления */}
            <div className="my-5 flex justify-center">
                <button
                    onClick={handleSearch} 
                    className="px-4 py-2 bg-[#4438ca] text-white rounded me-3"
                >
                    Поиск
                </button>
            

            {/* Поле поиска */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск товаров..."
                    className="border px-4 py-2 rounded w-[70%]"
                />
            </div>

            {/* Список товаров */}
            {!products || products?.data.length === 0 ? (
                <h1 className="text-5xl w-full h-[70%] flex items-center justify-center">Ничего не найдено</h1>
            ) : (

          
            <ul className="flex flex-wrap">
                {products?.data.map((product) => (
                    <li key={product.id} className="border w-[50%] sm:w-[25%] p-8">
                        <Image
                            src={product.image_preview}
                            width={150}
                            height={150}
                            alt={product.name}
                            className="w-[100%]"
                        />
                        <div className="flex flex-col mt-2">
                            <h2 className="whitespace-nowrap text-ellipsis overflow-hidden">{product.name}</h2>
                            <p className="text-[#4438ca]">Цена: {product.price}₽</p>
                        </div>
                    </li>
                ))}
            </ul>
            )}
            
            {/* Пагинация */}
            <div className="flex justify-center mt-5">
                <button
                    onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-[#4438ca] text-white rounded-l"
                >
                    Назад
                </button>

                <select
                    value={page}
                    onChange={handlePageChange} 
                    className=" border"
                >
                    {[...Array(products?.last_page)].map((_, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => setPage((prevPage) => prevPage + 1)}
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

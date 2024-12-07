'use client' // Убедитесь, что этот компонент выполняется на клиенте
import useSWR from 'swr';
import axios from '@/lib/axios';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';  
import { useState, useEffect } from 'react';

// Функция для загрузки товара
const loadProduct = async (slug) => {
    const url = `/api/products/${slug}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const OneProduct = () => {
    const router = useRouter(); // Получаем доступ к маршруту через useRouter
    const [slug, setSlug] = useState(null);   // Храним slug в состоянии

    // useEffect для обновления slug после того, как роутер будет готов
    useEffect(() => {
        if (router.isReady && router.query.slug) {  // Проверяем, что роутер готов
            setSlug(router.query.slug);  // Устанавливаем slug
        }
    }, [router.isReady, router.query.slug]);  // Эффект срабатывает, когда slug меняется

    // Если slug еще не загружен, показываем индикатор загрузки
    if (!slug) return <p>Загрузка...</p>;

    // Используем SWR для получения данных о товаре
    const { data: product, error, isLoading } = useSWR(
        slug ? `/api/products/${slug}` : null,  // Если slug существует, выполняем запрос
        loadProduct
    );

    // Обработка состояний загрузки и ошибок
    if (isLoading) return <Loader />;
    if (error) return <p>Ошибка загрузки товара</p>;
    if (!product) return <p>Товар не найден</p>;

    // Отображение данных о товаре
    return (
        <div className="product-detail">
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Цена: {product.price}₽</p>
            <img src={product.image_preview} alt={product.name} width={300} height={300} />
        </div>
    );
};

export default OneProduct;

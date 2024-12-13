import useSWR, { useSWRConfig } from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { reject } from 'lodash'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()
    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const {
        data: user,
        error,
        mutate,
    } = useSWR(
        '/api/user',
        () =>
            axios
                .get('/api/user')
                .then(res => res.data)
                .catch(err => {
                    if (err.response?.status === 401) {
                        return null
                    } else {throw err}
                    
                }),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false
        },
    )

    const register = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: params.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const logout = async () => {
        await csrf()

        if (!error) {
            await axios.post('/logout').then(() => mutate())
        } else {
            console.log('Ошибка:', error)
        }

        window.location.pathname = '/login'
    }

    const {
        data: cart,
        error: cartError,
        mutate: mutateCart,
    } = useSWR(
        user ? '/api/cart' : null,
        () =>
            axios
                .get('/api/cart')
                .then(res => res.data)
                .catch(error => {
                    if (error.response?.status === 401) {
                        return null
                    }
                    return null
                }),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    )

    const {
        data: orders,
        error: ordersError,
        mutate: mutateOrder,
    } = useSWR(
        user ? '/api/orders' : null,
        () =>
            axios
                .get('/api/orders')
                .then(res => res.data)
                .catch(error => {
                    if (error.response?.status === 401) {
                        return null
                    }
                    return null
                }),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    )

    const addToCart = async (productId, quantity) => {
        if (!user) {
            router.push('/login')
            return
        }

        await csrf()

        try {
            await axios.post('/api/cart', {
                product_id: productId,
                quantity: quantity,
            })
            mutateCart()
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error)
        }
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [user, error])
    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        logout,
        mutate,
        cart,
        addToCart,
        mutateCart,
        orders,
        mutateOrder,
    }
}

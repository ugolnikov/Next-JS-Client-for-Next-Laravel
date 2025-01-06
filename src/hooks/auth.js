import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()
    const csrf = async () => {
        const res = await axios.get('/sanctum/csrf-cookie')
        console.log('Response: ', res)
        console.log('Response headers: ', res.headers)
        console.log('Response cookie header: ', res.headers['set-cookie'])
        const cookie = (res.headers['set-cookie'])
            .find(cookie => cookie.includes('XSRF-TOKEN'))
            ?.match(new RegExp(`^${'XSRF-TOKEN'}=(.+?);`))
            ?.[1]
        const csrfToken = Cookies.get('XSRF-TOKEN')
        
        if (csrfToken) {
            axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken)
            console.log(csrfToken)
        } else {
            console.log('CSRF TOKEN IS MISSING')
            console.log('Cookies by js-cookie: ', Cookies.get())
            console.log('Cookies: ', Cookies.get())
            console.log('New Cookies: ', cookie) 
                
        }
    }

    const {
        data: user,
        error,
        mutate,
        isLoading
    } = useSWR(
        '/api/user',
        () =>
            axios
                .get('/api/user')
                .then(res => res.data)
                .catch(err => {
                    if (err.response?.status === 401) {
                        return null
                    }
                    throw err
                }),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
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

    const updatePhone = async (phone) => {
        await csrf()

        try {
            await axios.post('/api/update-phone', { phone })
            await mutate()
            return { success: true }
        } catch (error) {
            if (error.response?.status === 422) {
                return { success: false, errors: error.response.data.errors }
            }
            throw error
        }
    }

    const logout = async () => {
        await csrf()
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        } else {
            throw new Error('Ошибка:', error)
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
            throw new Error('Ошибка при добавлении в корзину:', error)
        }
    }

    useEffect(() => {
        if (isLoading) return

        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated)
        }

        if (middleware === 'auth' && !user) {
            router.push('/login')
        }
    }, [user, error, isLoading, middleware, redirectIfAuthenticated])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        updatePhone,
        mutate,
        cart,
        cartError,
        addToCart,
        mutateCart,
        orders,
        ordersError,
        mutateOrder,
        logout,
        isLoading
    }
}

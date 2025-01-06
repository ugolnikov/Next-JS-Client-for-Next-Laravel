import Axios from 'axios'
import Cookies from 'js-cookie' 

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, 
})

// Интерсептор для установки X-XSRF-TOKEN заголовка
axios.interceptors.request.use(config => {
    const token = Cookies.get('XSRF-TOKEN')
    if (token) {
        config.headers['X-XSRF-TOKEN'] = token
    }
    return config
}, error => {
    return Promise.reject(error)
})

export default axios
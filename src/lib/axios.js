import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    // headers: {
    //     'X-Requested-With': 'XMLHttpRequest',
    // },
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    withCredentials: true,
    withXSRFToken: true
})

export default axios
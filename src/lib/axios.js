import Axios from 'axios'
// import сookies from 'js-cookie' 

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, 
})


export default axios
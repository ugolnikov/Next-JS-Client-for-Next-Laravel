import Axios from 'axios'

const axios = Axios.create({
    baseURL: 'https://next-backend.ct.ws/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true
})
export default axios

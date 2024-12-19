import Axios from 'axios'

const axios = Axios.create({
    adapter: require('axios/lib/adapters/http'),
    baseURL: 'http://ugolnikov2.temp.swtest.ru/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true
})

export default axios

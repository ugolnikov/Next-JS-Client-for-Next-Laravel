import Axios from 'axios'

const axios = Axios.create({
    baseURL: 'http://ugolnikov2.temp.swtest.ru/',
    adapter: require('axios/lib/adapters/http'),
    // headers: {
    //     'X-Requested-With': 'XMLHttpRequest',
    // },
    withCredentials: true,
    withXSRFToken: true
})

export default axios

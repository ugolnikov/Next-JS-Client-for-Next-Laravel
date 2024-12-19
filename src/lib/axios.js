import Axios from 'axios'

const axios = Axios.create(
    {
    adapter: require('axios/lib/adapters/http'),
    httpAgent: new http.Agent({ keepAlive: true }),
    
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true,
    baseURL: 'http://ugolnikov2.temp.swtest.ru/',
    }
)

export default axios

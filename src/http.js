import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://www.liulongbin.top:8888/api/private/v1/'
})
instance.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

export default instance
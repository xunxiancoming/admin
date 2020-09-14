import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://www.liulongbin.top:8888/api/private/v1/'
})

export default instance
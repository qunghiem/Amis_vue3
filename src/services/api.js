import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// mọi response đều được xử lý tập trung tại đây, không cần try/catch ở các service nữa
api.interceptors.response.use(
  // trả về data trực tiếp cho các request thành công
  (res) => res,
  // log lỗi tập trung và trả về lỗi có message rõ ràng cho các request thất bại
  (err) => {
    const msg =
      err.response?.data?.userMsg || // Ưu tiên thông báo cho người dùng từ server
      err.response?.data?.devMsg || // Nếu không có, dùng thông báo cho dev
      err.message || // Nếu không có nữa, dùng lỗi mặc định của Axios
      'Lỗi kết nối máy chủ' // nếu mất mạng/server sập
    console.error('[API Error]', msg, err.response?.data)

    return Promise.reject(new Error(msg))
  },
)

export default api

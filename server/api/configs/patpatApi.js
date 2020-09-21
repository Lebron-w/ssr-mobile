module.exports = {
  // 基础url前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  // Body 参数 (post,put,delete 等请求参数)
  data: {},
  // Query 参数 （get 请求URL?后面拼接的参数）
  params: {},
  // 设置超时时间
  timeout: 15000, 
}

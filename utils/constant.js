/**
 * 描述: 自定义常量
 * 作者: BuYi
 * 日期: 2022年2月17日
*/


module.exports = {
  CODE_ERROR: false, // 请求响应失败code码
  CODE_SUCCESS: true, // 请求响应成功code码
  CODE_TOKEN_EXPIRED: 401, // 授权失败
  PRIVATE_KEY: 'buyiAo', // 自定义jwt加密的私钥
  JWT_EXPIRED: 60 * 60 * 24, // 过期时间24小时
} 
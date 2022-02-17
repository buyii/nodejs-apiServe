/**
 * 描述: 初始化路由信息，自定义全局异常处理
 * 作者: BuYi
 * 日期: 2022年2月17日
*/
var createError = require('http-errors');
const express = require('express');
// const boom = require('boom'); // 引入boom模块，处理程序异常状态
const userRouter = require('./users'); // 引入user路由模块
const taskRouter = require('./tasks'); // 引入task路由模块
const { jwtAuth, decode } = require('../utils/user-jwt'); // 引入jwt认证函数
const router = express.Router(); // 注册路由 

router.use(jwtAuth); // 注入认证模块

router.use('/api', userRouter); // 注入用户路由模块
router.use('/api', taskRouter); // 注入任务路由模块

/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理流程之后
 * 否则，会拦截正常请求
 */
 router.use((req, res, next) => {
  // console.log(404404)
  // res.status(404).json({ error: '接口不存在' })
  next(createError(404));
})


// 自定义统一异常处理中间件，需要放在代码最后
router.use((err, req, res, next) => {
  // 自定义用户认证失败的错误返回
  console.log('err===', err);
  if (err && err.status  === 401) {
    const { status = 401, message } = err;
    // 抛出401异常
    res.status(status).json({
      code: status,
      msg: 'token失效，请重新登录',
      data: null
    })
  } else {
    const { output } = err || {};
    // 错误码和错误信息
    const errCode = (err && err.status) || 500;
    const errMsg = (err && err.payload && err.payload.error) || err.message;
    res.status(errCode).json({
      code: errCode,
      msg: errMsg
    })
  }
})


module.exports = router;
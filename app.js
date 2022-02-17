/**
 * 描述: 入口文件
 * 作者: BuYi
 * 日期: 2022年2月17日
*/
var createError = require('http-errors');
const bodyParser = require('body-parser'); // 引入body-parser模块
const express = require('express'); // 引入express模块
const cors = require('cors'); // 引入cors模块
const routes = require('./routes'); //导入自定义路由文件，创建模块化路由
const app = express();

app.use(bodyParser.json()); // 解析json数据格式
app.use(bodyParser.urlencoded({extended: true})); // 解析form表单提交的数据application/x-www-form-urlencoded

app.use(cors()); // 注入cors模块解决跨域


app.use('/', routes);


/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理流程之后
 * 否则，会拦截正常请求
 */
app.use((req, res, next) => {
    // console.log(404404)
    // res.status(404).json({ error: '接口不存在' })
    next(createError(404));
})
  
  
  // 自定义统一异常处理中间件，需要放在代码最后
app.use((err, req, res, next) => {
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

module.exports = app;
// app.listen(8088, () => { // 监听8088端口
// 	console.log('服务已启动 http://localhost:8088');
// })
/**
 * 描述: 封装md5方法
 * 作者: BuYi
 * 日期: 2022年2月17日
*/

const crypto = require('crypto'); // 引入crypto加密模块

function md5(s) {
  return crypto.createHash('md5').update('' + s).digest('hex');
}

module.exports = md5;
/**
 * 描述: 连接mysql模块
 * 作者: BuYi
 * 日期: 2022年2月17日
*/

const mysql = require('mysql');
const config = require('../db/dbConfig');
const Result = require('./Result')

// 连接mysql
function connect() {
  const { host, user, password, database } = config;
  return mysql.createConnection({
    host,
    user,
    password,
    database
  })
}

// 新建查询连接
function querySql(sql,routerRes) { 
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, res) => {
        if (err) {
          reject(err);
          // err.sqlMessage
          new Result(null,'服务器异常').failStatus(routerRes,500)
        } else {
          resolve(res);
        }
      })
    } catch (e) {
      reject(e);
    } finally {
      // 释放连接
      conn.end();
    }
  })
}

// 查询一条语句
function queryOne(sql,routerRes) {
  return new Promise((resolve, reject) => {
    querySql(sql).then(res => {
      console.log('res===',res)
      if (res && res.length > 0) {
        resolve(res[0]);
      } else {
        resolve(null);
      }
    }).catch(err => {
      new Result(null, '服务器异常').failStatus(routerRes,500)
      reject(err);
    })
  })
}

module.exports = {
  querySql,
  queryOne
}
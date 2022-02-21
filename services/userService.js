/**
 * 描述: 业务逻辑处理 - 用户相关接口
 * 作者: BuYi
 * 日期: 2022年2月17日
*/


const { querySql, queryOne } = require('../utils/index');
const md5 = require('../utils/md5');
const jwt = require('jsonwebtoken');
const Result = require('../utils/Result')
const { body, validationResult } = require('express-validator');
const { 
  CODE_ERROR,
  CODE_SUCCESS, 
  PRIVATE_KEY, 
  JWT_EXPIRED 
} = require('../utils/constant');
const { decode } = require('../utils/user-jwt');


// 登录
function login(req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    new Result(null, msg).fail(res)
  } else {
    let { username, password } = req.body;
    // md5加密
    password = md5(password);
    const query = `select * from users where username='${username}' and password='${password}'`;
    querySql(query,res)
    .then(user => {
    	// console.log('用户登录===', user);
      if (!user || user.length === 0) {
        new Result(null, '用户名或密码错误').fail(res)
      } else {
        // 登录成功，签发一个token并返回给前端
        const token = jwt.sign(
          // payload：签发的 token 里面要包含的一些数据。
          { username },
          // 私钥
          PRIVATE_KEY,
          // 设置过期时间
          { expiresIn: JWT_EXPIRED }
        )

        let userData = {
          id: user[0].id,
          username: user[0].username,
          nickname: user[0].nickname,
          avator: user[0].avator,
          sex: user[0].sex,
          gmt_create: user[0].gmt_create,
          gmt_modify: user[0].gmt_modify
        };
        let data = { 
          token,
          userData
        }
        new Result(data, '登录成功').success(res)
      }
    })
  }
}


// 注册
function register(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    new Result(null, msg).fail(res)
  } else {
    let { username, password } = req.body;
    findUser(username)
  	.then(data => {
  		// console.log('用户注册===', data);
  		if (data) {
        new Result(null, '用户已存在').fail(res)
  		} else {
	    	password = md5(password);
  			const query = `insert into users(username, password) values('${username}', '${password}')`;
  			querySql(query,res)
		    .then(result => {
		    	// console.log('用户注册===', result);
		      if (!result || result.length === 0) {
            new Result(null, '注册失败').fail(res)
		      } else {
            const queryUser = `select * from users where username='${username}' and password='${password}'`;
            querySql(queryUser,res)
            .then(user => {
              const token = jwt.sign(
                { username },
                PRIVATE_KEY,
                { expiresIn: JWT_EXPIRED }
              )

              let userData = {
                id: user[0].id,
                username: user[0].username,
                nickname: user[0].nickname,
                avator: user[0].avator,
                sex: user[0].sex,
                gmt_create: user[0].gmt_create,
                gmt_modify: user[0].gmt_modify
              };
              let data = { 
                token,
                userData
              } 
              new Result(data, '注册成功').success(res)
            })
		      }
		    })
  		}
  	})
   
  }
}

// 重置密码
function resetPwd(req, res, next) {
	const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    new Result(null, msg).fail(res)
  } else {
    let { username, oldPassword, newPassword } = req.body;
    oldPassword = md5(oldPassword);
    validateUser(username, oldPassword)
    .then(data => {
      // console.log('校验用户名和密码===', data);
      if (data) {
        if (newPassword) {
          newPassword = md5(newPassword);
				  const query = `update users set password='${newPassword}' where username='${username}'`;
				  querySql(query,res)
          .then(user => {
            // console.log('密码重置===', user);
            if (!user || user.length === 0) {
              new Result(null, '重置密码失败').fail(res)
            } else {
              new Result(null, '重置密码成功').success(res)
            }
          })
        } else {
          new Result(null, '新密码不能为空').fail(res)
        }
      } else {
        new Result(null, '用户名或旧密码错误').fail(res)
      }
    })
   
  }
}

// 校验用户名和密码
function validateUser(username, oldPassword) {
	const query = `select id, username from users where username='${username}' and password='${oldPassword}'`;
  	return queryOne(query,res);
}

// 通过用户名查询用户信息
function findUser(username) {
  const query = `select id, username from users where username='${username}'`;
  return queryOne(query,res);
}

module.exports = {
  login,
  register,
  resetPwd
}

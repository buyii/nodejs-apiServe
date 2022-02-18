const {
  CODE_ERROR,
  CODE_SUCCESS
} = require('../utils/constant')

class Result {
  constructor(data, msg = '执行成功', options) {
    this.data = data
    this.msg = msg
    if (options) {
      this.options = options
    }
  }

  createResult() {
    // if (!this.code) {
    //   this.code = CODE_SUCCESS
    // }
    let base = {
      success: this.code,
      data: this.data,
      msg: this.msg
    }
    if (this.options) {
      base = { ...base, ...this.options }
    }
    return base
  }

  json(res) {
    res.json(this.createResult())
  }

  success(res) {
    this.code = CODE_SUCCESS
    this.json(res)
  }

  fail(res) {
    this.code = CODE_ERROR
    this.json(res)
  }
  
  failStatus(res,status) {
    this.code = CODE_ERROR
    res.status(status).json(this.createResult())
  }
}

module.exports = Result

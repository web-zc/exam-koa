const mongoose = require('mongoose')
const { Schema, model } = mongoose
// authSchema 权限表
const authSchema = new Schema({
  auth: { // 权限
    type: String,
    required: true,
  },
  icon: { // 图标
    type: String
  },
  date: { // 创建时间
    type: Number,
    default: Date.now
  },

  __v: {
    select: false // 返回数据时不包括这一项
  }


})
// 生成模型
module.exports = mo = model('Auth', authSchema, 'auth')
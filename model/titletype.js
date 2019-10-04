const mongoose = require('mongoose')
const {Schema, model} = mongoose
// titletypeSchema 题目类别表
const titletypeSchema = new Schema({
  titletype:{ // 题目类别
    type:String,
    required: true,
  },
  __v:{
    select: false // 返回数据时不包括这一项
  }


})
// 生成模型
module.exports = mo = model('Titletype',titletypeSchema,'titletype')
const mongoose = require('mongoose')
const {Schema, model} = mongoose
// papertypeSchema 试卷类别表
const papertypeSchema = new Schema({
  papertype:{ // 试卷类别
    type:String,
    required: true,
  },
  __v:{
    select: false // 返回数据时不包括这一项
  }


})
// 生成模型
module.exports = mo = model('Papertype',papertypeSchema,'papertype')
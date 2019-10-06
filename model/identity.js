const mongoose = require('mongoose')
const {Schema, model} = mongoose
// identitySchema 角色表
const identitySchema = new Schema({
  identity:{ // 身份
    type:String,
    required: true,
  },
  des:{ // 身份描述
    type:String,
  },
  aid://  权限
    { 
      type:Array
    },
    date:{ // 创建时间
      type:Number,
      default: Date.now
     },  
  __v:{
    select: false // 返回数据时不包括这一项
  }


})
// 生成模型
module.exports = mo = model('Identity',identitySchema,'identity')
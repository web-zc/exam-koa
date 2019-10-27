const mongoose = require('mongoose')
const {Schema, model} = mongoose
// subauthSchema 子权限表
const subauthSchema = new Schema({
  auth:{ // 权限
    type:String,
    required: true,
  },
  icon:{ // 图标
    type:String
  },
  path:{ // 路径
    type:String,
    required:true
  },
  faids:// 父权限(auth)id
    {
      type: Schema.Types.ObjectId
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
module.exports = mo = model('Subauth',subauthSchema,'subauth')
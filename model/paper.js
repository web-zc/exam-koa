const mongoose = require('mongoose')
const {Schema, model} = mongoose
// paperSchema 试卷表
const paperSchema = new Schema({
  papername:{ // 试卷名
    type:String,
    required: true,
  },
  pid:{ // 试卷类别id
    type: Schema.Types.ObjectId,
    required:true,
   },
   datax:{ // 建议时长
     type:Number,
   },
   status:{ // 试卷状态 默认禁用
    type:String,
    enum: ['0', '1'], default: '0', required: true
   },
   title:{
      type:Array,
      required:true
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
module.exports = mo = model('Paper',paperSchema,'paper')
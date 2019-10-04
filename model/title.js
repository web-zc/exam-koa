const mongoose = require('mongoose')
const {Schema, model} = mongoose
// titleSchema 题目表
const titleSchema = new Schema({
  title:{ // 题干
    type:String,
    required: true,
  },
  A:{ 
    type:String,
    required:true
  },
  B:{ 
    type:String,
    required:true
  },
  C:{ 
    type:String,
    required:true
  },
  D:{ 
    type:String,
    required:true
  },
  answea:{ // 答案
    type:String,
    required:true
  },
  score:{ // 分值
    type:String,
    required:true,
    default:'3'
  },
  difficulty:{ //难度
    type:String,
    enum: ['1', '2','3','4','5'], default: '3', required: true
   },
   tyid:{ // 题目类别id
    type: Schema.Types.ObjectId,
    required:true,
   },
  __v:{
    select: false // 返回数据时不包括这一项
  }


})
// 生成模型
module.exports = mo = model('Title',titleSchema,'title')
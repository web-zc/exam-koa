const mongoose = require('mongoose')
const {Schema, model} = mongoose
// userSchema 用户表
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  zname:{
    type: String,//真实姓名
  },
  mobile:{ //手机号
  type:String
  },
  password: {
    type: String,
    required: true
  },
  avatar: { //头像
    type: String,
    default:'',
  },
  gender: { // 性别，枚举
    type: String,
    enum: ['male', 'fmale'], default: 'male', 
  },
  personal:{ // 个人简介
    type: String
  },
  state:{ // 用户状态
    type:String,
    enum: ['0', '1'], default: '1', 
  },
  iid:{ // 身份id
    type: Schema.Types.ObjectId,
    default:'5d94b9ad24139d0fb00fb500',// 默认学生角色
  },
  classx:{ //年级
   type:String,
   enum: ['大一', '大二','大三'], default: '大一', 
  },
  __v:{
    select: false // 返回数据时不包括这一项
  }


})
// 生成模型
module.exports = mo = model('User',userSchema,'user')




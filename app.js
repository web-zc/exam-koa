const Koa = require('koa')
const app = new Koa()
// 解析body
const bodyparser = require('koa-bodyparser')
app.use(bodyparser())

// 链接数据库
const mongoose = require('mongoose')
mongoose.connect('mongodb://139.196.72.164/exam',{useNewUrlParser: true,useCreateIndex: true})
.then(()=>{
  console.log('mongodb start')
})
.catch((err)=>{
  console.log(err)
})

// 路由
const router = require('./router/router') 

// 跨域
const cors = require('koa2-cors')
app.use(cors()) 
app
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(3090,()=>{
  console.log('listen 3090')
})
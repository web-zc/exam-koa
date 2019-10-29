const Koa = require('koa')
const app = new Koa()
const path = require('path')
const koaStatic = require('koa-static')
// 指定目录
app.use(koaStatic(path.join(__dirname, '/public')))
// 解析body
const koaBody = require('koa-body')

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
app.use(koaBody({
  multipart: true, // 启用文件
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'), // 设置上传文件目录
    keepExtensions: true, // 保留扩展名
    maxFileSize: 2*1024*1024, // 限制文件大小2M
  }
}))
app
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(3090,()=>{
  console.log('listen 3090')
})
const Router = require('koa-router')
const mongoose = require('mongoose')
const Titletype = require('../model/titletype')
const Title = require('../model/title')
const titleRouter = new Router({ prefix: '/title' })
const jwt = require('jsonwebtoken')
// token认证中间件 放在路由 是函数
const auth = async (ctx, next) => {
  let url = ctx.request.url;
  // 登录 注冊 不用检查
  // 从请求头获取token
  const { token = '' } = ctx.request.header
  const tokenx = token.replace('Bearer ', '')
  // token解密
  try {
    var payload = jwt.verify(tokenx, 'aaa')
    await next()
  } catch (error) {
    console.log('没有token')
    ctx.body = { meta: { msg: "没有token", status: 5044 } }
  }
}
// $route POST /api/title/titletype
// @desc 新增题目类别
titleRouter.post('/titletype',auth, async (ctx) => {
  const user = await new Titletype(ctx.request.body).save()
  ctx.body = { meta: { msg: "新增成功", status: 200 }, data: user }
})
// $route GET /api/title/titletype
// @desc 获取题目类别
titleRouter.get('/titletype',auth, async (ctx) => {
  const user = await Titletype.find()
  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})
// $route POST /api/title
// @desc 新增题目
titleRouter.post('/',auth, async (ctx) => {
  const user = await new Title(ctx.request.body).save()
  ctx.body = { meta: { msg: "新增成功", status: 200 }, data: user }
})
// $route GET /api/title/
// @desc 获取题目列表
titleRouter.get('/',auth, async (ctx) => {
  let pagesize = ctx.query.pagesize || 10
  let pagenumber = ctx.query.pagenumber || 1
  const count = await Title.count()
  const user = await Title.aggregate([{ $skip: pagesize * (pagenumber - 1) }, { $limit: pagesize * 1 }, { $lookup: { from: 'titletype', localField: 'tyid', foreignField: '_id', as: 'items' } }])
  ctx.body = { meta: { msg: "获取成功", status: 200 }, count, data: user }
})
// $route GET /api/title/
// @desc 获取题目列表x 随机题目用
titleRouter.get('/sum',auth, async (ctx) => {
  const user = await Title.find()
  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})
// $route GET /api/title/search
// @desc 获取题目列表 高级功能 分页 过滤1
titleRouter.get('/search', async (ctx) => {
  let pagesize = ctx.query.pagesize || 10
  let pagenumber = ctx.query.pagenumber || 1
  Number(ctx.query.difficulty)
  if (ctx.query.tyid === "") {
    const count = await Title.aggregate([{ $match: { title: { $regex: ctx.query.title, $options: 'i' }, } }])
    const userx = await Title.aggregate([{ $match: { title: { $regex: ctx.query.title, $options: 'i' } } }, { $skip: pagesize * (pagenumber - 1) }, { $limit: pagesize * 1 }, { $lookup: { from: 'titletype', localField: 'tyid', foreignField: '_id', as: 'items' } }])

    ctx.body = { meta: { msg: "获取成功", status: 200 }, count: count.length, data: userx }
  } else {
    const count = await Title.aggregate([{ $match: { title: { $regex: ctx.query.title, $options: 'i' },tyid: mongoose.Types.ObjectId(ctx.query.tyid) } }])
    const user = await Title.aggregate([{ $match: { title: { $regex: ctx.query.title, $options: 'i' }, tyid: mongoose.Types.ObjectId(ctx.query.tyid) } }, { $skip: pagesize * (pagenumber - 1) }, { $limit: pagesize * 1 }, { $lookup: { from: 'titletype', localField: 'tyid', foreignField: '_id', as: 'items' } }]) 
    ctx.body = { meta: { msg: "获取成功", status: 200 }, count: count.length, data: user }
  }
})

// $route DELETE /api/title/:id
// @desc 删除指定题目
titleRouter.delete('/:id',auth, async (ctx) => {
  const user = await Title.findByIdAndRemove(ctx.params.id)
  if (!user) {
    ctx.body = { meta: { msg: "题目不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "删除成功", status: 204 }, data: user }
})
// $route PUT /api/title/:id
// @desc  编辑题目
titleRouter.put('/:id',auth, async (ctx) => {
  const user = await Title.findByIdAndUpdate(ctx.params.id, ctx.request.body)
  if (!user) {
    ctx.body = { meta: { msg: "题目不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "编辑成功", status: 200 }, data: user }
})
module.exports = titleRouter.routes()

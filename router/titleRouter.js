const Router = require('koa-router')
const mongoose = require('mongoose')
const Titletype = require('../model/titletype')
const Title = require('../model/title')
const titleRouter = new Router({prefix:'/title'})

// $route POST /api/title/titletype
// @desc 新增题目类别
titleRouter.post('/titletype', async (ctx) => {
  const user = await new Titletype(ctx.request.body).save()
  ctx.body = { meta: { msg: "新增成功", status: 200 }, data: user }
})
// $route GET /api/title/titletype
// @desc 获取题目类别
titleRouter.get('/titletype', async (ctx) => {
  const user = await Titletype.find()
  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})
// $route POST /api/title
// @desc 新增题目
titleRouter.post('/', async (ctx) => {
  const user = await new Title(ctx.request.body).save()
  ctx.body = { meta: { msg: "新增成功", status: 200 }, data: user }
})
// $route GET /api/title/
// @desc 获取题目列表
titleRouter.get('/', async (ctx) => {
  let pagesize = ctx.query.pagesize ||10
  let pagenumber = ctx.query.pagenumber||1
  const count = await Title.count()
  const user = await Title.aggregate([{ $skip: pagesize * (pagenumber - 1) }, { $limit: pagesize * 1 }, { $lookup: { from: 'titletype', localField: 'tyid', foreignField: '_id', as: 'items' } }])
  ctx.body = { meta: { msg: "获取成功",  status: 200 },count, data: user }
})
// $route GET /api/title/
// @desc 获取题目列表x 随机题目用
titleRouter.get('/sum', async (ctx) => {
  const user = await Title.find()
  ctx.body = { meta: { msg: "获取成功",  status: 200 }, data: user }
})
// $route GET /api/title/search
// @desc 获取题目列表 高级功能 分页 过滤
titleRouter.get('/search', async (ctx) => {
  let pagesize = ctx.query.pagesize || 10
  let pagenumber = ctx.query.pagenumber || 1
  if(ctx.query.tyid==""){
    const user = await Title.aggregate([{ $match: { title: { $regex: ctx.query.title, $options: 'i' },difficulty: { $regex: ctx.query.difficulty, $options: 'i' } } }, { $skip: pagesize * (pagenumber - 1) }, { $limit: pagesize * 1 },{ $lookup: { from: 'titletype', localField: 'tyid', foreignField: '_id', as: 'items' } }])
    ctx.body = { meta: { msg: "获取成功", status: 200 },  data: user }
    const count = await Title.aggregate([{ $match: { title: { $regex: ctx.query.title, $options: 'i' },difficulty: { $regex: ctx.query.difficulty, $options: 'i' } } }])
    ctx.body = { meta: { msg: "获取成功", status: 200 }, count:count.length, data: user }
  }else{
    const user = await Title.aggregate([{ $match: { title: { $regex: ctx.query.title, $options: 'i' },difficulty: { $regex: ctx.query.difficulty, $options: 'i' },tyid: mongoose.Types.ObjectId(ctx.query.tyid) } }, { $skip: pagesize * (pagenumber - 1) }, { $limit: pagesize * 1 },{ $lookup: { from: 'titletype', localField: 'tyid', foreignField: '_id', as: 'items' } }])
    ctx.body = { meta: { msg: "获取成功", status: 200 },  data: user }
    const count = await Title.aggregate([{ $match: { title: { $regex: ctx.query.title, $options: 'i' },difficulty: { $regex: ctx.query.difficulty, $options: 'i' },tyid: mongoose.Types.ObjectId(ctx.query.tyid) } }])
    ctx.body = { meta: { msg: "获取成功", status: 200 }, count:count.length, data: user }
  }
  
})


// $route DELETE /api/title/:id
// @desc 删除指定题目
titleRouter.delete('/:id', async (ctx) => {
  const user = await Title.findByIdAndRemove(ctx.params.id)
  if (!user) {
    ctx.body = { meta: { msg: "题目不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "删除成功", status: 204 }, data: user }
})
// $route PUT /api/title/:id
// @desc  编辑题目
titleRouter.put('/:id', async (ctx) => {
  const user = await Title.findByIdAndUpdate(ctx.params.id, ctx.request.body)
  if (!user) {
    ctx.body = { meta: { msg: "题目不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "编辑成功", status: 200 }, data: user }
})
module.exports = titleRouter.routes()

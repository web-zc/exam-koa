const Router = require('koa-router')
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
  const count = await Title.find()
  const user = await Title.find().skip(pagesize * (pagenumber - 1)).limit(pagesize*1)
  ctx.body = { meta: { msg: "获取成功", count:count.length, status: 200 }, data: user }
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
// @desc  编辑用户
titleRouter.put('/:id', async (ctx) => {
  const user = await Title.findByIdAndUpdate(ctx.params.id, ctx.request.body)
  if (!user) {
    ctx.body = { meta: { msg: "题目不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "编辑成功", status: 200 }, data: user }
})
module.exports = titleRouter.routes()

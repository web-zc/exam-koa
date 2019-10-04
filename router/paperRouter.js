const Router = require('koa-router')
const Paper = require('../model/paper')
const Papertype = require('../model/papertype')
const paperRouter = new Router({prefix:'/paper'})

// $route POST /api/paper/papertype
// @desc 新增试卷类别
paperRouter.post('/papertype', async (ctx) => {
  const user = await new Papertype(ctx.request.body).save()
  ctx.body = { meta: { msg: "新增成功", status: 200 }, data: user }
})
// $route GET /api/paper/papertype
// @desc 获取试卷类别
paperRouter.get('/papertype', async (ctx) => {
  const user = await Papertype.find()
  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})
// $route POST /api/paper/
// @desc 新增试卷
paperRouter.post('/', async (ctx) => {
  const user = await new Paper(ctx.request.body).save()
  ctx.body = { meta: { msg: "新增成功", status: 200 }, data: user }
})

module.exports = paperRouter.routes()

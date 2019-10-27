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
// $route PUT /api/paper/:id
// @desc  编辑试卷
paperRouter.put('/:id', async (ctx) => {
  const user = await Paper.findByIdAndUpdate(ctx.params.id, ctx.request.body)
  if (!user) {
    ctx.body = { meta: { msg: "试卷不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "编辑成功", status: 200 }, data: user }
})
// $route DElETE/api/paper/:id
// @desc  删除用户
paperRouter.delete('/:id', async (ctx) => {
  const user = await Paper.findByIdAndRemove(ctx.params.id)
  if (!user) {
    ctx.body = { meta: { msg: "试卷不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "删除成功", status: 204 }, data: user }
})
// $route GET /api/paper
// @desc 获取试卷列表
paperRouter.get('/', async (ctx) => {
  const user = await Paper.aggregate([{ $lookup: { from: 'papertype', localField: 'pid', foreignField: '_id', as: 'arr' } }])
  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})
// $route POST /api/paper/
// @desc 新增试卷
paperRouter.post('/', async (ctx) => {
  const user = await new Paper(ctx.request.body).save()
  ctx.body = { meta: { msg: "新增成功", status: 200 }, data: user }
})

module.exports = paperRouter.routes()

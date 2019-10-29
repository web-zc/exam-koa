const Router = require('koa-router')
const Paper = require('../model/paper')
const Papertype = require('../model/papertype')
const paperRouter = new Router({ prefix: '/paper' })
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
// $route POST /api/paper/papertype
// @desc 新增试卷类别
paperRouter.post('/papertype',auth, async (ctx) => {
  const user = await new Papertype(ctx.request.body).save()
  ctx.body = { meta: { msg: "新增成功", status: 200 }, data: user }
})
// $route GET /api/paper/papertype
// @desc 获取试卷类别
paperRouter.get('/papertype',auth, async (ctx) => {
  const user = await Papertype.find()
  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})
// $route PUT /api/paper/:id
// @desc  编辑试卷
paperRouter.put('/:id',auth, async (ctx) => {
  const user = await Paper.findByIdAndUpdate(ctx.params.id, ctx.request.body)
  if (!user) {
    ctx.body = { meta: { msg: "试卷不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "编辑成功", status: 200 }, data: user }
})
// $route DElETE/api/paper/:id
// @desc  删除用户
paperRouter.delete('/:id',auth, async (ctx) => {
  const user = await Paper.findByIdAndRemove(ctx.params.id)
  if (!user) {
    ctx.body = { meta: { msg: "试卷不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "删除成功", status: 204 }, data: user }
})
// $route GET /api/paper
// @desc 获取试卷列表
paperRouter.get('/',auth, async (ctx) => {
  const user = await Paper.aggregate([{ $lookup: { from: 'papertype', localField: 'pid', foreignField: '_id', as: 'arr' } }])
  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})
// $route POST /api/paper/
// @desc 新增试卷
paperRouter.post('/',auth, async (ctx) => {
  const user = await new Paper(ctx.request.body).save()
  ctx.body = { meta: { msg: "新增成功", status: 200 }, data: user }
})

module.exports = paperRouter.routes()

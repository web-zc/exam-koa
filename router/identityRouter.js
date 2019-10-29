const Router = require('koa-router')
const Identity = require('../model/identity')
const Auth = require('../model/auth')
const Subauth = require('../model/subauth')
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
const identityRouter = new Router({ prefix: '/identity' })
// $route GET /api/identity
// @desc 返回json
identityRouter.get('/test',auth, async (ctx) => {
  ctx.body = { testf: 'ok' }
})


// $route POST /api/identity/subauth/add
// @desc 添加子权限
identityRouter.post('/subauth/add',auth, async (ctx) => {
  const user = await new Subauth(ctx.request.body).save()
  ctx.body = { meta: { msg: "添加成功", status: 200 }, data: user }
})
// $route GET /api/identity/subauth
// @desc 获取子权限
identityRouter.get('/subauth',auth, async (ctx) => {
  const user = await Subauth.find()
  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})
// $route DELETE /api/identity/subauth
// @desc 删除所有子权限
identityRouter.delete('/subauth',auth, async (ctx) => {
  const user = await Subauth.deleteMany()
  ctx.body = { meta: { msg: "删除成功", status: 200 }, data: user }
})
// $route DELETE /api/identity/subauth/:id
// @desc 删除子权限
identityRouter.delete('/subauth/:id',auth, async (ctx) => {
  const user = await Subauth.findByIdAndDelete(ctx.params.id)
  ctx.body = { meta: { msg: "删除成功", status: 200 }, data: user }
})
// $route PUT /api/identity/subauth/:id
// @desc 编辑子权限
identityRouter.put('/subauth/:id',auth, async (ctx) => {
  const user = await Subauth.findByIdAndUpdate(ctx.params.id, ctx.request.body)
  ctx.body = { meta: { msg: "编辑成功", status: 200 }, data: user }
})
// $route POST /api/identity/auth/add
// @desc 添加权限
identityRouter.post('/auth/add',auth, async (ctx) => {
  const user = await new Auth(ctx.request.body).save()
  ctx.body = { meta: { msg: "添加成功", status: 200 }, data: user }
})
// $route PUT /api/identity/auth/:id
// @desc 编辑权限
identityRouter.put('/auth/:id',auth, async (ctx) => {
  const user = await Auth.findByIdAndUpdate(ctx.params.id, ctx.request.body)
  ctx.body = { meta: { msg: "添加成功", status: 200 }, data: user }
})
// $route GET /api/identity/auth
// @desc 获取权限
identityRouter.get('/auth',auth, async (ctx) => {
  const user = await Auth
    .aggregate([{ $lookup: { from: 'subauth', localField: '_id', foreignField: 'faids', as: 'itmes' } }])
  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})
// $route DELETE /api/identity/auth
// @desc 删除所有权限
identityRouter.delete('/auth',auth, async (ctx) => {
  const user = await Auth.deleteMany()
  ctx.body = { meta: { msg: "删除成功", status: 204 }, data: user }
})
// $route DELETE /api/identity/auth/:id
// @desc 删除权限
identityRouter.delete('/auth/:id',auth, async (ctx) => {
  const user = await Auth.findByIdAndDelete(ctx.params.id)
  ctx.body = { meta: { msg: "删除成功", status: 204 }, data: user }
})
// $route PUT /api/identity/right/:aid
// @desc 角色授权 重复了
identityRouter.put('/right/:aid',auth, async (ctx) => {

  const user = await Identity.findByIdAndUpdate(ctx.params.aid, { aid: ctx.request.body })
  if (!user) {
    ctx.body = { meta: { msg: "角色不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "编辑成功", status: 200 }, data: user }
})

// $route POST /api/identity/add
// @desc 添加角色
identityRouter.post('/add',auth, async (ctx) => {
  const { identity } = ctx.request.body
  const reuser = await Identity.findOne({ identity: identity })
  if (reuser) {
    ctx.body = { meta: { msg: "角色重复", status: 409 }, data: reuser }
    return;
  }
  const user = await new Identity(ctx.request.body).save()
  ctx.body = { meta: { msg: "添加成功", status: 200 }, data: user }
})
// $route GET /api/identity
// @desc 获取角色列表
identityRouter.get('/',auth, async (ctx) => {
  const user = await Identity.find()
  ctx.body = { meta: { msg: "添加成功", status: 200 }, data: user }
})
// $route GET /api/identity/search
// @desc  通过关键字搜索角色
identityRouter.get('/:id',auth, async (ctx) => {
  const user = await Identity.aggregate([{ $match: { identity: { $regex: ctx.query.name, $options: 'i' }, } }])

  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})

// $route GET /api/identity/:id
// @desc  获取指定角色
identityRouter.get('/:id',auth, async (ctx) => {
  const user = await Identity.findById(ctx.params.id)
  if (!user) {
    ctx.body = { meta: { msg: "角色不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})
// $route PUT /api/identity/:id
// @desc  编辑角色
identityRouter.put('/:id',auth, async (ctx) => {
  const user = await Identity.findByIdAndUpdate(ctx.params.id, ctx.request.body)
  if (!user) {
    ctx.body = { meta: { msg: "角色不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "编辑成功", status: 200 }, data: user }
})
// $route DElETE /api/identity/:id
// @desc  删除角色
identityRouter.delete('/:id',auth, async (ctx) => {
  const user = await Identity.findByIdAndRemove(ctx.params.id)
  if (!user) {
    ctx.body = { meta: { msg: "角色不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "删除成功", status: 204 }, data: user }
})


module.exports = identityRouter.routes()
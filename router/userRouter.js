const Router = require('koa-router')
const User = require('../model/user')
const mongoose = require('mongoose')
const userRouter = new Router({ prefix: '/users' })
// $route GET /api/users/test
// @desc 返回json
userRouter.get('/test', async (ctx) => {
  ctx.body = { testf: 'ok' }
})

// $route POST /api/users/register
// @desc 注册用户
userRouter.post('/register', async (ctx) => {
  console.log(ctx.request.body)

  const { username } = ctx.request.body
  const reuser = await User.findOne({ username: username })
  if (reuser) {
    ctx.body = { meta: { msg: "用户名重复", status: 409 }, data: reuser }
    return;
  }
  const user = await new User(ctx.request.body).save()
  ctx.body = { meta: { msg: "注册成功", status: 200 }, data: user }
})
// $route GET /api/users/
// @desc  获取用户列表 分页
userRouter.get('/', async (ctx) => {
  let pagesize = ctx.query.pagesize || 10
  let pagenumber = ctx.query.pagenumber || 1
  const count = await User.count()
  const user = await User.aggregate([{ $skip: pagesize * (pagenumber - 1) }, { $limit: pagesize * 1 }, { $lookup: { from: 'identity', localField: 'iid', foreignField: '_id', as: 'arr' } }])
  ctx.body = { meta: { msg: "获取成功", status: 200 }, count, data: user }
})

// $route POST /api/users/login
// @desc  登陆用户
userRouter.post('/login', async (ctx) => {
  const user = await User.findOne(ctx.request.body)
  if (!user) {
    ctx.body = { meta: { msg: "用户名或密码错误", status: 500 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "登陆成功", status: 200 }, data: user }
})
// $route GET /api/users/search
// @desc  高级搜索功能 分页,模糊查询，筛选
userRouter.get('/search', async (ctx) => {
  let pagesize = ctx.query.pagesize || 10
  let pagenumber = ctx.query.pagenumber || 1
  if(ctx.query.iid==""){
    
    const user = await User.aggregate([{ $match: { username: { $regex: ctx.query.username, $options: 'i' }, classx: { $regex: ctx.query.classx, $options: 'i' }, gender: { $regex: ctx.query.gender, $options: 'i' }, state: { $regex: ctx.query.state, $options: 'i' } } }, { $skip: pagesize * (pagenumber - 1) }, { $limit: pagesize * 1 }, { $lookup: { from: 'identity', localField: 'iid', foreignField: '_id', as: 'arr' } }])
    const count = await User.aggregate([{ $match: { username: { $regex: ctx.query.username, $options: 'i' }, classx: { $regex: ctx.query.classx, $options: 'i' }, gender: { $regex: ctx.query.gender, $options: 'i' }, state: { $regex: ctx.query.state, $options: 'i' } } }])
    ctx.body = { meta: { msg: "获取成功", status: 200 }, count:count.length, data: user }
  }else{
    const count = await User.aggregate([{ $match: { username: { $regex: ctx.query.username, $options: 'i' }, classx: { $regex: ctx.query.classx, $options: 'i' }, gender: { $regex: ctx.query.gender, $options: 'i' }, state: { $regex: ctx.query.state, $options: 'i' },iid: mongoose.Types.ObjectId(ctx.query.iid)  } }])
    const user = await User.aggregate([{ $match: { username: { $regex: ctx.query.username, $options: 'i' }, classx: { $regex: ctx.query.classx, $options: 'i' }, gender: { $regex: ctx.query.gender, $options: 'i' }, state: { $regex: ctx.query.state, $options: 'i' },iid:  mongoose.Types.ObjectId(ctx.query.iid) } }, { $skip: pagesize * (pagenumber - 1) }, { $limit: pagesize * 1 }, { $lookup: { from: 'identity', localField: 'iid', foreignField: '_id', as: 'arr' } }])
    
    ctx.body = { meta: { msg: "获取成功", status: 200 }, count:count.length, data: user }
  }
})
// $route GET /api/users/:id
// @desc  获取指定用户用户
userRouter.get('/:id', async (ctx) => {
  const user = await User.findById(ctx.params.id)
  if (!user) {
    ctx.body = { meta: { msg: "用户不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "获取成功", status: 200 }, data: user }
})

// $route PUT /api/users/:id
// @desc  编辑用户
userRouter.put('/:id', async (ctx) => {
  const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
  if (!user) {
    ctx.body = { meta: { msg: "用户不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "编辑成功", status: 200 }, data: user }
})
// $route PUT /api/users/:id/identity/:iid
// @desc  分配用户身份
userRouter.put('/:id/identity/:iid', async (ctx) => {
  const user = await User.findByIdAndUpdate(ctx.params.id, { iid: ctx.params.iid })
  if (!user) {
    ctx.body = { meta: { msg: "用户不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "分配成功", status: 200 }, data: user }
})
// $route DElETE /api/users/:id
// @desc  删除用户
userRouter.delete('/:id', async (ctx) => {
  const user = await User.findByIdAndRemove(ctx.params.id)
  if (!user) {
    ctx.body = { meta: { msg: "用户不存在", status: 404 }, data: user }
    return;
  }
  ctx.body = { meta: { msg: "删除成功", status: 204 }, data: user }
})
module.exports = userRouter.routes()

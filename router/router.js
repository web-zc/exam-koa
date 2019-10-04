const Router = require('koa-router')
const userRouter = require('./userRouter')
const identityRouter = require('./identityRouter')
const titleRouter = require('./titleRouter')
const paperRouter = require('./paperRouter')
var router = new Router()
// /api/users
router.use('/api', userRouter);
router.use('/api', identityRouter);
router.use('/api', titleRouter);
router.use('/api', paperRouter);
module.exports = router

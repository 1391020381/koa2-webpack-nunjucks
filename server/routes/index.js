const router = require('koa-router')()
const {render} = require('../common/utils')
router.get('/', async (ctx, next) => {
  // await ctx.render('index', {
  //   title: 'Hello Koa 2!'
  // })
  console.log('首页')
     try{
       await render(ctx,'index',{title:'行云流水justdoit'})
     }catch(e){
        console.log(e)
      // next(e)
     }
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router

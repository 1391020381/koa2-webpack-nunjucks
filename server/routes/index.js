const router = require('koa-router')()
router.get('/', async (ctx, next) => {
     try{
      
      await ctx.render('index',{title:'行云流水111111111',items:[{ title: "foo", id: 1 }, { title: "bar", id: 2}]})
     }catch(e){
        console.log(e)
      next(e)
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

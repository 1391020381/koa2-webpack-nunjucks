const router = require('koa-router')()
const nunjucks = require('nunjucks')
router.get('/', async (ctx, next) => {
     try{
      
      await ctx.render('index',{title:'行云流水justdoit',items:[1,2,3,4]})
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

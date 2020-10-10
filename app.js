const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const isDev = process.env.NODE_ENV === 'development'
// error handler
onerror(app)

// middlewares

const koaWebpack = require('koa-webpack')
const webpack = require('webpack')
const webpackConfig = require('./build/webpack.dev.config')

// async function startApp(){
//    const compiler = webpack(config)
//    try{
//      const middleware = await koaWebpack({
//        compiler
//      })
//      app.use(middleware)
//      app.use(serve(resolve(__dirname,'./dist')))
//      app.listen(3000,()=>{
//          console.log('server is listening http://127.0.0.1:3000`')
//      })
//    }catch(e){
//      console.log(e)
//    }
// }

if(isDev){
    async  function addKoaWebapck(){
      const compiler = webpack(config)
       try{
          const koaWebpackMiddleware = await koaWebpack({
            compiler
          })
          app.use(koaWebpackMiddleware)
       }catch(e){
         console.log(e)
       }
    }
}else{

}


app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'njk'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

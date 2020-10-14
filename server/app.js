const path = require('path')
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaStatic = require('koa-static')
const index = require('./routes/index')
const users = require('./routes/users')

const catchError = require('./middlewares/exception')

const koaWebpack = require('koa-webpack')
const webpack = require('webpack')
const webpackConfig = require('../build/webpack.dev.config')
const isDev = process.env.NODE_ENV === 'development'




// error handler
onerror(app)

// middlewares


app.use(catchError)

if(isDev){
    async  function addKoaWebapck(){
      const compiler = webpack(webpackConfig)
       try{
         const  koaWebpackMiddleware = await koaWebpack({
            compiler
          })
          app.use(koaWebpackMiddleware)
          // app.use(webpackConfig.output.publicPath, express.static(path.join(__dirname, '../src')))
          app.use(koaStatic(webpackConfig.output.publicPath,path.join(__dirname,`../client`)))
       }catch(e){
         console.log(e)
       }
    }

    addKoaWebapck()
}else{
 
  app.use(views(__dirname + `../${CONFIG.DIR.DIST}`, {
    extension: 'html'
  }))
   // app.use(express.static(path.join(__dirname, `../${CONFIG.DIR.DIST}`)))
   app.use(koaStatic(path.join(__dirname,`../${CONFIG.DIR.DIST}`)))
}


app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))



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

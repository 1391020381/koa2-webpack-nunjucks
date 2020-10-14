const path = require('path')
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const koaStaticServer = require('koa-static-server')
const index = require('./routes/index')
const users = require('./routes/users')

const catchError = require('./middlewares/exception')

const {devMiddleware,hotMiddleware} = require('koa-webpack-middleware')
const webpack = require('webpack')
const webpackConfig = require('../build/webpack.dev.config')
const isDev = process.env.NODE_ENV === 'development'
const CONFIG = require('../build/config.json')



// error handler
onerror(app)

// middlewares


 app.use(catchError)

if(isDev){
    const compiler = webpack(webpackConfig)
    app.use(devMiddleware(compiler,{
      publicPath: webpackConfig.output.publicPath
    }))
    app.use(hotMiddleware(compiler,{
      publicPath: webpackConfig.output.publicPath,
		  noInfo: true
    }))

    // 指定开发环境下的静态资源目录
  console.log('staticPath:',path.join(__dirname,`../client`))
  app.use(koaStaticServer({rootPath:webpackConfig.output.publicPath,rootDir:path.join(__dirname,`../client`)}))
}else{
 
  app.use(views(__dirname + `../${CONFIG.DIR.DIST}`, {
    extension: 'html'
  }))
   
  //  app.use(koaStatic(path.join(__dirname,`../${CONFIG.DIR.DIST}`)))
  app.use(koaStaticServer({rootPath:'',rooDir:path.join(__dirname,`../${CONFIG.DIR.DIST}`)}))
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

const axios = require('axios')
const nunjucks = require('nunjucks')
const CONFIG = require('../../build/config.json')
const isDev = process.env.NODE_ENV  === 'development'
const path = require('path')
const { env } = require('process')


function getTemplateString (filename) {
	return new Promise((resolve, reject) => {
		axios.get(`http://localhost:${CONFIG.PORT}${CONFIG.PATH.PUBLIC_PATH}${CONFIG.DIR.VIEW}/${filename}`)
			.then(res => {
				resolve(res.data)
			})
			.catch(reject)
	})
}


async function render (ctx, filename, data) {
	// 文件后缀
	const ext = '.html'
	filename = filename.indexOf(ext) > -1 ? filename.split(ext)[0] : filename
	try {
		if (isDev) {
			const template = await getTemplateString(`${filename}.html`)
			console.log('template:',template)
			if(template){
				nunjucks.configure(template,{
					tags:{
						variableStart: '<%',
                        variableEnd: '%>',
					}
				})
				let html = nunjucks.renderString(template,data)
				ctx.set('Content-Type', 'text/html; charset=utf-8')
				ctx.body = html
			}else{
				ctx.body = '404'
			}
			
		} else {
			ctx.render(filename, data)
		}
		 return Promise.resolve()
	} catch (e) {
		 return Promise.reject(e)
	}
}
module.exports = {
    getTemplateString,
    render
}
const axios = require('axios')
const nunjucks = require('nunjucks')
const CONFIG = require('../../build/config.json')
const isDev = process.env.NODE_ENV  === 'development'
const path = require('path')


function getTemplateString (filename) {
	return new Promise((resolve, reject) => {
		console.log('getTemplateString-url',`http://localhost:${CONFIG.PORT}${CONFIG.PATH.PUBLIC_PATH}${CONFIG.DIR.VIEW}/${filename}`)
		axios.get(`http://localhost:${CONFIG.PORT}${CONFIG.PATH.PUBLIC_PATH}${CONFIG.DIR.VIEW}/${filename}`)
			.then(res => {
				console.log('getTemplateString-result',res.data)
				resolve(res.data)
			})
			.catch(reject)
	})
}


async function render (ctx, filename, data) {
	// 文件后缀
	
	const ext = '.html'
	filename = filename.indexOf(ext) > -1 ? filename.split(ext)[0] : filename
	console.log('filename:',filename,isDev)
	try {
		if (isDev) {
			const template = await getTemplateString(`${filename}.html`)
			let html = nunjucks.render(template, data)
			console.log('html:',html)
			ctx.body = html
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
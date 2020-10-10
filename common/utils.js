const axios = require('axios')
const nunjucks = require('nunjucks')
const CONFIG = require('../build/config.json')
const isDev = process.env.NODE_ENV  === 'development'


function getTemplateString (filename) {
	return new Promise((resolve, reject) => {
		axios.get(`http://localhost:${CONFIG.PORT}${CONFIG.PATH.PUBLIC_PATH}${CONFIG.DIR.VIEW}/${filename}`)
			.then(res => {
				resolve(res.data)
			})
			.catch(reject)
	})
}


async function render (res, filename, data) {
	// 文件后缀
	const ext = '.njk'
	filename = filename.indexOf(ext) > -1 ? filename.split(ext)[0] : filename
	try {
		if (isDev) {
			const template = await getTemplateString(`${filename}.ejs`)
			let html = nunjucks.render(template, data)
			res.send(html)
		} else {
			res.render(filename, data)
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
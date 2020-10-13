const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const glob = require('glob')
const path = require('path')
const  CONFIG = require('./config.json')

const isDev = process.env.NODE_ENV ==='development'

function getEntries(filepathList){
	// console.log('filepathList:',JSON.stringify(filepathList))
     let entry = {}
     filepathList.forEach(filepath => {
		const list = filepath.split(/[\/|\/\/|\\|\\\\]/g) // eslint-disable-line  // 斜杠分割文件目录
		// console.log('list:',list)
		// const key = list[list.length - 1].replace(/\.js/g, '')
		const key = list[7]                             // 拿到文件的 filename
        // 如果是开发环境，才需要引入 hot module
        entry[key] = isDev ? [filepath, 'webpack-hot-middleware/client?reload=true'] : filepath
	})
	console.log('entry:',JSON.stringify(entry))
    return entry
}

module.exports = {
    entry:getEntries(glob.sync(path.resolve(__dirname,'../client/public/javascripts/src/**/index.js'))),
    output:{
        path: path.resolve(__dirname, `../${CONFIG.DIR.DIST}`),
		publicPath: CONFIG.PATH.PUBLIC_PATH,
		filename: `${CONFIG.DIR.SCRIPT}/[name].bundle.js`,
		chunkFilename: `${CONFIG.DIR.SCRIPT}/[name].[chunkhash].js`
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '../client'),
			js: path.resolve(__dirname, '../client/public/javascripts'),
			css: path.resolve(__dirname, '../client/public/stylesheets/css'),
			less: path.resolve(__dirname, '../client/public/stylesheets/less')
		}
	},
    module:{
        rules:[
            {
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /(node_modules|lib|libs)/
            },
            {
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					'url-loader'
				]
            },
            // {
			// 	test: /\.html$/,
			// 	use: [
			// 		{
			// 			loader: 'html-loader',
			// 			options: {
			// 				attrs: ['img:src', 'img:data-src', ':data-background']
			// 			}
			// 		}
			// 	]
            // },
            // {
			// 	test: /\.njk$/,
			// 	use: [
			// 		{
			// 			loader: 'html-loader',
			// 			options: {
			// 				attrs: ['img:src', 'img:data-src', ':data-background']
			// 			}
			// 		},
			// 		{
			// 			loader: 'nunjucks-html-loader',
			// 			options: {
			// 				production: process.env.ENV === 'production'
			// 			}
			// 		}
			// 	]
			// }
        ]
    },
    plugins: [
		// new CopyWebpackPlugin([
		// 	{
		// 		from: resolve(__dirname, '../src/css/lib'),
		// 		to: resolve(__dirname, `../${CONFIG.DIR.DIST}/${CONFIG.DIR.STYLE}`),
		// 		writeToDisk: !isDev
		// 	}
		// ]),
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		// 打包文件
		...glob.sync(path.resolve(__dirname, '../client/views/**/*.njk')).map((filepath, i) => {
			const tempList = filepath.split(/[\/|\/\/|\\|\\\\]/g) // eslint-disable-line
			// 读取 CONFIG.EXT 文件自定义的文件后缀名，默认生成 ejs 文件，可以定义生成 html 文件
			const filename = (name => `${name.split('.')[0]}.${CONFIG.EXT}`)(`${CONFIG.DIR.VIEW}/${tempList[tempList.length - 1]}`)
			const template = filepath
			const fileChunk = filename.split('.')[0].split(/[\/|\/\/|\\|\\\\]/g).pop() // eslint-disable-line
			const chunks = isDev ? [ fileChunk ] : ['manifest', 'vendors', fileChunk]
			return new HtmlWebpackPlugin({ filename, template, chunks })
		})
	]
}
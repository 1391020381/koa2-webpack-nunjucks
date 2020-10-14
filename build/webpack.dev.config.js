const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const CONFIG = require('./config.json')

const webpackBaseConfig = require('./webpack.base.config')

module.exports = webpackMerge.merge(webpackBaseConfig, {
	module: {
		rules: [
			{
				test: /\.less|\.css$/,
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
				]
			}
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		}),
		// OccurrenceOrderPlugin is needed for webpack 1.x only
		new webpack.optimize.OccurrenceOrderPlugin(),
	//	new webpack.HotModuleReplacementPlugin(),
		// Use NoErrorsPlugin for webpack 1.x
		new webpack.NoEmitOnErrorsPlugin()
	],

	devtool: 'cheap-module-eval-source-map',

	mode: 'development'
})
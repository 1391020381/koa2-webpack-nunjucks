const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CONFIG = require('./config')

const webpackBaseConfig = require('./webpack.base.config')
const { loader } = require('mini-css-extract-plugin')

module.exports = webpackMerge.merge(webpackBaseConfig, {
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
				  MiniCssExtractPlugin.loader, 'css-loader','postcss-loader' // postcss-loader 可选
				],
			  },{
				test: /\.less$/,
				use: [
				  MiniCssExtractPlugin.loader, 'css-loader','postcss-loader','less-loader' // postcss-loader 可选
				],
			  }
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
        new MiniCssExtractPlugin({
			filename:`${CONFIG.DIR.STYLE}/[name].[contenthash].css`,
			chunkFilename: `${CONFIG.DIR.STYLE}/[id].[contenthash].css`
		})
	],

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					minChunks: 1,
					chunks: 'all',
					priority: 100
				}
			}
		},
		runtimeChunk: {
			name: 'manifest'
		}
	},

	devtool: 'cheap-module-source-map',

	mode: 'production'
})
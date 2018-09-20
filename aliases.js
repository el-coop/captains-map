const path = require('path')
const webpack = require('webpack')

module.exports = {
	resolve: {
		alias: {
			'$scss': path.resolve(__dirname, 'src/assets/styles'),
			'@': path.resolve(__dirname, 'src'),
		}
	}
};
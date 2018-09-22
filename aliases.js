const path = require('path');

module.exports = {
	resolve: {
		alias: {
			'~$scss': path.resolve(__dirname, 'src/assets/styles'),
			'@': path.resolve(__dirname, 'src'),
		}
	}
};
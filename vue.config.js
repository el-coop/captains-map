const path = require('path');

module.exports = {
	configureWebpack: {
		resolve: {
			alias: {
				'$scss': path.resolve(__dirname, 'src/assets/styles'),
			}
		}
	},
	devServer: {
		public: 'localhost:8080',
		proxy: {
			"/api/*": {
				target: "http://localhost:3000",
				secure: false
			}
		}
	},
	pwa: {
		name: 'Captains Map',
		workboxPluginMode: "GenerateSW",
		themeColor: '#209CEE',
		msTileColor:'#363636',
		appleMobileWebAppCapable: "yes"

	}
};
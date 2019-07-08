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
		workboxPluginMode: "InjectManifest",
		workboxOptions: {
			swSrc: './src/service-worker.js'
		},
		themeColor: '#209CEE',
		msTileColor: '#363636',
		appleMobileWebAppCapable: "yes",
		iconPaths: {
			favicon32: 'img/icons/favicon-32x32.png',
			favicon16: 'img/icons/favicon-16x16.png',
			appleTouchIcon: 'img/icons/icon-120x120.png',
			maskIcon: 'img/icons/pinned.svg',
			msTileImage: 'img/icons/icon-144x144.png'
		}
	}
};

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {VitePWA} from 'vite-plugin-pwa'
import {fileURLToPath, URL} from 'node:url'

export default defineConfig({
	resolve: {
		alias: {
			'$scss': fileURLToPath(new URL('./src/assets/styles', import.meta.url)),
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'~': fileURLToPath(new URL('./node_modules', import.meta.url)),
		},
	},
	server: {
		port: 8080,
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				secure: false,
			}
		}
	},
	plugins: [
		vue(),
		VitePWA({
			strategies: "InjectManifest",
			registerType: null,
			srcDir: "src",
			filename: "service-worker.js",
			manifest: {
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
			},
			manifestFilename: "./public/manifest.json"

		}),
		{
			name: "singleHMR",
			handleHotUpdate({ modules }) {
				modules.map((m) => {
					m.importedModules = new Set();
					m.importers = new Set();
				});

				return modules;
			},
		},
	],
});

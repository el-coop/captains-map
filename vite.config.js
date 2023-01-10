import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {VitePWA} from 'vite-plugin-pwa'
import {fileURLToPath, URL} from 'node:url'
import topLevelAwait from "vite-plugin-top-level-await";
import { splitVendorChunkPlugin } from 'vite'

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
			injectRegister: null,
			srcDir: "src",
			filename: "service-worker.js",
			manifest: {
				name: "Captains Map",
				short_name: "Captains Map",
				icons: [
					{
						src: "img/icons/icon-72x72.png",
						sizes: "72x72",
						type: "image/png"
					},
					{
						src: "img/icons/icon-96x96.png",
						sizes: "96x96",
						type: "image/png"
					},
					{
						src: "img/icons/icon-128x128.png",
						sizes: "128x128",
						type: "image/png"
					},
					{
						src: "img/icons/icon-144x144.png",
						sizes: "144x144",
						type: "image/png"
					},
					{
						src: "img/icons/icon-152x152.png",
						sizes: "152x152",
						type: "image/png"
					},
					{
						src: "img/icons/icon-192x192.png",
						sizes: "192x192",
						type: "image/png"
					},
					{
						src: "img/icons/icon-384x384.png",
						sizes: "384x384",
						type: "image/png"
					},
					{
						src: "img/icons/icon-512x512.png",
						sizes: "512x512",
						type: "image/png"
					}
				],
				start_url: "/",
				display: "standalone",
				orientation: "portrait",
				background_color: "#363636",
				theme_color: "#209CEE",
			},
			manifestFilename: "manifest.json"
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
		splitVendorChunkPlugin(),
		topLevelAwait({}),
	],
	test: {
		include: ['tests/unit/**/CreateMarker/*.spec.js'],
	}
});

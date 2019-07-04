import Router from 'vue-router';
import ViewPage from '@/Views/ViewPage';
import EditPage from '@/Views/EditPage';
import Auth from '@/Middleware/AuthMiddleware';
import cache from "@/Services/Cache";

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/edit',
			name: 'edit',
			component: EditPage,
			beforeEnter: Auth.handle
		},
		{
			path: '/:username?/:marker?',
			name: 'view',
			component: ViewPage
		},
	]
});

router.pushRoute = function (location) {
	history.pushState(null, null, `${window.location.protocol}//${window.location.host}/${location}`);
};

router.afterEach(async (to, from) => {
	if (from.name && (to.fullPath === '/edit' || to.fullPath === '/')) {
		await cache.store('settings', 'route', to.fullPath);
	}
});

export default router;

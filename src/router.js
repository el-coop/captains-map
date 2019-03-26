import Router from 'vue-router';
import ViewLayout from '@/Views/ViewLayout';
import EditLayout from '@/Views/EditLayout';
import Auth from '@/Middleware/Auth.middleware';
import cache from "@/Services/cache.service";

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/edit',
			name: 'edit',
			component: EditLayout,
			beforeEnter: Auth.handle
		},
		{
			path: '/:username?/:marker?',
			name: 'view',
			component: ViewLayout
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

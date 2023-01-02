import { createRouter, createWebHistory } from 'vue-router'
import ViewPage from '@/Views/ViewPage';
import EditPage from '@/Views/EditPage';
import StoryPage from '@/Views/StoryPage';
import Auth from '@/Middleware/AuthMiddleware';
import cache from "@/Services/Cache";

const router = createRouter({
	history: createWebHistory(),
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
		{
			path: '/:username/story/:story/:marker?',
			name: 'story',
			component: StoryPage
		},
	]
});

router.pushRoute = async function (location) {
	history.pushState(null, null, `${window.location.protocol}//${window.location.host}/${location}`);
};

router.afterEach(async (to, from) => {
	if (from.name) {
		await cache.store('settings', 'route', to.fullPath);
	}
});

export default router;

import Vue from 'vue';
import Router from 'vue-router';
import ViewLayout from '@/views/ViewLayout';
import EditLayout from '@/views/EditLayout';
import Auth from './middleware/Auth.middleware';


Vue.use(Router);

export default new Router({
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
})

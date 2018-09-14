import Router from 'vue-router';
import ViewLayout from '@/views/ViewLayout';
import EditLayout from '@/views/EditLayout';
import Auth from './middleware/Auth.middleware';


export default new Router({
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
})

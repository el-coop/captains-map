<template>
	<div class="dashboard" :class="{'dashboard--big-mobile-header' : loggedIn}">
		<div class="dashboard__header dashboard__control dashboard__control--dark">
			<logged-in-bar v-if="loggedIn"/>
			<logged-out-bar v-else/>
		</div>
		<div class="dashboard__body">
			<profile/>
			<div class="dashboard__control dashboard__body-sidebar" :class="{open: openSidebar}">
				<marker-list/>

				<div class="content copyright">
					Map data available thanks to © OpenStreetMap contributors.
					<a href="https://www.openstreetmap.org/copyright" target="_blank">Copyright info</a>
				</div>
			</div>
		</div>
		<div class="dashboard__control is-hidden-tablet">
			<button class="button is-fullwidth is-dark is-medium" @click="openSidebar = !openSidebar">
				Show {{ openSidebar ? 'Map' : 'List'}}
			</button>
		</div>
		<create-marker v-if="editMode" :latLng="latLng"/>
		<view-marker :marker="selectedMarker"/>
	</div>
</template>

<script>
	import DashboardMixin from '@/Components/Dashboard/DashboardMixin';
	import MarkerList from "@/Components/Dashboard/SideBar/MarkerList";
	import ViewMarker from "@/Components/Modals/ViewMarker";
	import Profile from "@/Components/edit/Profile";
	import CreateMarker from "@/Components/edit/CreateMarker";
	import LoggedInBar from '@/Components/Dashboard/TopBar/LoggedInBar';
	import LoggedOutBar from '@/Components/Dashboard/TopBar/LoggedOutBar';
	import auth from '@/Services/authentication.service';

	export default {
		name: "dashboard",

		mixins: [DashboardMixin],

		components: {
			Profile,
			ViewMarker,
			CreateMarker,
			MarkerList,
			LoggedInBar,
			LoggedOutBar
		},

		computed: {
			loggedIn() {
				return auth.isLoggedIn();
			}
		}
	}
</script>
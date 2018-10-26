<template>
	<div class="dashboard" :class="{'dashboard--big-mobile-header' : loggedIn}">
		<div class="dashboard__header dashboard__control dashboard__control--dark">
			<logged-in-bar v-if="loggedIn"/>
			<logged-out-bar v-else/>
		</div>
		<div class="dashboard__body">
			<profile/>
			<transition name="slide-up">
				<div class="dashboard__control dashboard__body-sidebar" v-if="openSidebar">
					<marker-list/>

					<div class="content copyright">
						Map data available thanks to © OpenStreetMap contributors.<br>
						© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> | © <a
							href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> | <a
							href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>
					</div>
				</div>
			</transition>
		</div>
		<div class="dashboard__control dashboard__footer is-hidden-tablet">
			<marker-borders-filter class="h-100">
				<button class="button is-light is-outlined is-marginless" @click="openSidebar = !openSidebar">
					<font-awesome-icon icon="list" size="sm"/>
					<span class="is-size-7">Show {{ openSidebar ? 'Map' : 'List'}}</span>
				</button>
			</marker-borders-filter>
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
	import MarkerBordersFilter from "@/Components/Utilities/MarkerBordersFilter";

	export default {
		name: "dashboard",

		mixins: [DashboardMixin],

		components: {
			MarkerBordersFilter,
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
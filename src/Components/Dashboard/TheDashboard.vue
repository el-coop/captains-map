<template>
	<div class="dashboard" :class="{'dashboard--with-profile': hasUsername}">
		<div class="dashboard__header dashboard__control dashboard__control--accent">
			<LoggedInBar v-if="loggedIn"/>
			<LoggedOutBar v-else/>
		</div>

		<div class="dashboard__body">
			<Profile v-if="hasUsername"/>
			<div class="dashboard__control dashboard__sidebar"
				 :class="{'dashboard__sidebar--filters': showFilters}">
				<MarkerBordersFilter/>
				<MarkerList>
					<div class="copyright">
						Map data available thanks to © OpenStreetMap contributors.<br>
						© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> | © <a
							href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> | <a
							href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>
					</div>
				</MarkerList>
			</div>

		</div>
		<ViewMarker/>
	</div>
</template>

<script>
	import MarkerList from "@/Components/Dashboard/SideBar/MarkerList";
	import ViewMarker from "@/Components/Modals/ViewMarker";
	import Profile from "@/Components/Dashboard/Profile";
	import LoggedInBar from '@/Components/Dashboard/TopBar/LoggedInBar';
	import LoggedOutBar from '@/Components/Dashboard/TopBar/LoggedOutBar';
	import auth from '@/Services/AuthenticationService';
	import MarkerBordersFilter from "@/Components/Utilities/MarkerBordersFilter";

	export default {
		name: "TheDashboard",


		components: {
			MarkerBordersFilter,
			Profile,
			ViewMarker,
			MarkerList,
			LoggedInBar,
			LoggedOutBar
		},


		data() {
			return {
				selectedMarker: null,
				mountModal: false,
				showFilters: false
			}
		},

		computed: {
			loggedIn() {
				return auth.isLoggedIn();
			},

			hasUsername() {
				return this.$store.state.Markers.username;
			}
		}
	}
</script>

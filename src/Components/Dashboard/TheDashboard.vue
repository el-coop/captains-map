<template>
	<div class="dashboard" :class="{'dashboard--with-profile': hasUsername}">
		<div class="dashboard__header dashboard__control dashboard__control--dark">
			<LoggedInBar v-if="loggedIn"/>
			<LoggedOutBar v-else/>
		</div>

		<div class="dashboard__body">
			<Profile v-if="hasUsername"></Profile>
			<div v-else></div>
			<transition name="slide-up">
				<div class="dashboard__control dashboard__body-sidebar" v-if="openSidebar">
					<MarkerList/>
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
			<MarkerBordersFilter class="h-100">
				<button class="button is-light is-outlined is-marginless is-faded has-icon-top"
						@click="openSidebar = !openSidebar">
					<FontAwesomeIcon icon="list" size="sm"/>
					<span class="is-size-7">Show {{ openSidebar ? 'Map' : 'List'}}</span>
				</button>
			</MarkerBordersFilter>
		</div>

		<ViewMarker :marker="selectedMarker"/>
	</div>
</template>

<script>
	import MarkerList from "@/Components/Dashboard/SideBar/MarkerList";
	import ViewMarker from "@/Components/Modals/ViewMarker";
	import Profile from "@/Components/Dashboard/Profile";
	import LoggedInBar from '@/Components/Dashboard/TopBar/LoggedInBar';
	import LoggedOutBar from '@/Components/Dashboard/TopBar/LoggedOutBar';
	import auth from '@/Services/authentication.service';
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
				openSidebar: window.matchMedia("(min-width: 769px)").matches,
				mountModal: false,
			}
		},

		created() {
			this.$bus.$on('moving-map', this.closeSidebar);
			this.$bus.$on('marker-click', this.showMarker);
		},
		beforeDestroy() {
			this.$bus.$off('marker-click', this.showMarker);
			this.$bus.$off('moving-map', this.closeSidebar);
		},

		methods: {
			showMarker(marker) {
				this.selectedMarker = marker;
				this.$modal.show('view-marker');
			},

			closeSidebar() {
				if (!window.matchMedia("(min-width: 769px)").matches) {
					this.openSidebar = false;
				}
			},

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

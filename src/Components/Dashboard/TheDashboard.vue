<template>
	<div class="dashboard" :class="{'dashboard--with-profile': hasUsername}">
		<div class="dashboard__header dashboard__control dashboard__control--accent">
			<LoggedInBar v-if="$store.state.User.user"/>
			<LoggedOutBar v-else/>
		</div>

		<div class="dashboard__body">
			<template v-if="hasUsername">
				<ProfileEdit v-if="profileEdit"/>
				<ProfileDisplay v-else/>
			</template>
			<div class="dashboard__control dashboard__sidebar">
				<MarkerBordersFilter/>
				<MarkerList>
					<div class="copyright">
						Map data available thanks to © OpenStreetMap contributors.<br>
						© <a href='https://www.mapbox.com/about/maps/' target="_blank" rel="noreferrer">Mapbox</a> | ©
						<a
								href='http://www.openstreetmap.org/copyright' target="_blank" rel="noreferrer">OpenStreetMap</a>
						| <a
							href='https://www.mapbox.com/map-feedback/' target="_blank" rel="noreferrer">Improve this
						map</a>
					</div>
				</MarkerList>
			</div>

		</div>
		<ViewMarker @close="$emit('close')" :selectedMarker="selectedMarker"/>
	</div>
</template>

<script>
	import MarkerList from "@/Components/Dashboard/SideBar/MarkerList";
	import ViewMarker from "@/Components/Modals/ViewMarker";
	import Profile from "@/Components/Dashboard/Profile";
	import LoggedInBar from '@/Components/Dashboard/TopBar/LoggedInBar';
	import LoggedOutBar from '@/Components/Dashboard/TopBar/LoggedOutBar';
	import MarkerBordersFilter from "@/Components/Utilities/MarkerBordersFilter";
	import ProfileEdit from "@/Components/Dashboard/Profile/ProfileEdit";
	import ProfileDisplay from "@/Components/Dashboard/Profile/ProfileDisplay";

	export default {
		name: "TheDashboard",
        emits:['close'],
        
		components: {
			ProfileDisplay,
			ProfileEdit,
			MarkerBordersFilter,
			Profile,
			ViewMarker,
			MarkerList,
			LoggedInBar,
			LoggedOutBar
		},
        
        props: {
            selectedMarker:{}
        },


		data() {
			return {
				mountModal: false,
			}
		},

		computed: {
			profileEdit() {
				const user = this.$store.state.User.user;
				const profileUser = this.$store.state.Profile.user;

				if (!user || !profileUser) {
					return false;
				}
				return user.username === profileUser.username;
			},

			hasUsername() {
				return this.$store.state.Markers.username;
			}
		}
	}
</script>

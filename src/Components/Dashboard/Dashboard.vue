<template>
	<div class="dashboard">
		<top-bar class="dashboard__header"/>
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
	import TopBar from "@/Components/Dashboard/TopBar/TopBar";
	import ViewMarker from "@/Components/Global/ViewMarker";
	import Profile from "@/Components/edit/Profile";
	import CreateMarker from "@/Components/edit/CreateMarker";

	export default {
		name: "dashboard",

		mixins: [DashboardMixin],

		components: {
			Profile,
			ViewMarker,
			TopBar,
			CreateMarker,
			MarkerList,
		},

	}
</script>
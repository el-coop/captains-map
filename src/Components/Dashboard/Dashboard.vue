<template>
	<div class="dashboard">
		<top-bar/>
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
		<view-marker :marker="selectedMarker"/>
	</div>
</template>

<script>
	import DashboardMixin from '@/Components/Dashboard/DashboardMixin';
	import MarkerList from "@/Components/Global/MarkerList";
	import TopBar from "@/Components/View/TopBar";
	import ViewMarker from "@/Components/Global/ViewMarker";
	import Profile from "@/Components/edit/Profile";

	export default {
		name: "dashboard",

		mixins: [DashboardMixin],

		components: {
			Profile,
			ViewMarker,
			TopBar,
			MarkerList,
		},

	}
</script>
<template>
    <div class="layout">
        <map-view/>
        <view-dashboard/>
    </div>
</template>

<script>
	import MapView from "@/components/map/Map";
	import ViewDashboard from "../components/view/Dashboard";

	export default {
		name: "view-layout",

		components: {
			ViewDashboard,
			MapView
		}
	}
</script>

<style scoped>
</style>
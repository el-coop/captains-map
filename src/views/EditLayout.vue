<template>
    <div class="layout">
        <map-view/>
        <edit-dashboard/>
    </div>
</template>

<script>
	import MapView from "@/components/map/Map";
	import EditDashboard from "@/components/edit/Dashboard";

	export default {
		name: "edit-layout",

		components: {
			MapView,
			EditDashboard
		}
	}
</script>

<style scoped>
</style>
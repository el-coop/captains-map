<template>
    <div class="layout">
        <map-view></map-view>
        <edit-dashboard></edit-dashboard>
    </div>
</template>

<script>
	import MapView from "@/components/Map";
	import EditDashboard from "@/components/edit/EditDashboard";

	export default {
		name: "layout",

		components: {
			MapView,
			EditDashboard
		}
	}
</script>

<style scoped>
    .layout {
        position: relative;
        height: 100vh;
        width: 100vw;
    }
</style>
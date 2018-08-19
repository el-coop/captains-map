<template>
    <div class="layout">
        <view-dashboard/>
    </div>
</template>

<script>
	import ViewDashboard from "../components/view/Dashboard";

	export default {
		name: "view-layout",

		components: {
			ViewDashboard,
		}
	}
</script>

<style scoped>
</style>
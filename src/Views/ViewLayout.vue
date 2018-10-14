<template>
    <div class="layout">
        <view-dashboard/>
    </div>
</template>

<script>
	import ViewDashboard from "@/Components/view/Dashboard";

	export default {
		name: "view-layout",

		components: {
			ViewDashboard,
		}
	}
</script>
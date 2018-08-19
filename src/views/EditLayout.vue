<template>
    <div class="layout">
        <edit-dashboard/>
    </div>
</template>

<script>
	import EditDashboard from "@/components/edit/Dashboard";

	export default {
		name: "edit-layout",

		components: {
			EditDashboard
		}
	}
</script>
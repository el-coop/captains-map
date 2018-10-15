<template>
	<div class="layout">
		<edit-dashboard/>
	</div>
</template>

<script>
	import EditDashboard from "@/Components/edit/Dashboard";

	export default {
		name: "edit-layout",

		metaInfo: {
			title: 'Edit'
		},

		components: {
			EditDashboard
		}
	}
</script>
<template>
	<div class="uploads-list">
		<button class="button is-faded has-icon-top uploads-list__button"
				@click="open = !open">
			<FontAwesomeIcon icon="upload" size="sm"/>
			<span class="is-size-7" v-text="open ? 'Hide Uploads' : 'Show Uploads'"/>
		</button>
		<ul v-if="open" class="marker-list">
			<li v-for="marker in markers" class="marker-list__entry" :key="marker.uploadTime">
				<UploadEntry :marker="marker"/>
			</li>
		</ul>
	</div>
</template>

<script>
	import UploadEntry from "@/Components/Dashboard/SideBar/UploadEntry.vue";

	export default {
		name: "UploadsList",

		components: {UploadEntry},

		data() {
			return {
				open: false
			};
		},

		computed: {
			markers() {
				return this.$store.getters['Uploads/allFiles'];
			},
		},
	}
</script>

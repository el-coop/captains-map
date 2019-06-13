<template>
	<div>
		<button class="button is-light is-outlined is-fullwidth is-marginless is-faded has-icon-top h-auto"
				@click="open = !open">
			<FontAwesomeIcon icon="upload" size="sm"/>
			<span class="is-size-7">Show Uploads</span>
		</button>
		<ul v-if="open">
			<li v-for="marker in markers" class="media marker-list__media" :key="marker.uploadTime">
				<UploadEntry :marker="marker"></UploadEntry>
			</li>
		</ul>
	</div>
</template>

<script>
	import UploadEntry from "@/Components/Dashboard/SideBar/UploadEntry";

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

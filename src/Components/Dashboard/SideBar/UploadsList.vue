<template>
	<div>
		<button class="button is-light is-outlined is-fullwidth is-marginless is-faded has-icon-top h-auto"
				@click="open = !open">
			<font-awesome-icon icon="upload" size="sm"/>
			<span class="is-size-7">Show Uploads</span>
		</button>
		<ul v-if="open">
			<li v-for="marker in markers" class="media" :key="marker.uploadTime">
				<upload-entry :marker="marker"></upload-entry>
			</li>
		</ul>
	</div>
</template>

<script>
	import UploadEntry from "@/Components/Dashboard/SideBar/UploadEntry";

	export default {
		name: "uploads-list",

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

<style scoped lang="scss">
	.media {
		+ .media {
			margin-top: 0;
			padding-top: 0;
		}
	}

	.buttons {
		margin: 7px;

		> .button {
			flex: 1;
		}
	}

	.loader {
		margin: 1em auto;
	}
</style>

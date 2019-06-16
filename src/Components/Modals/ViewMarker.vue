<template>
	<SlideUpModal name="view-marker" :route-name="routeName">
		<template #header v-if="marker">
			<ViewMarkerHeader :marker="marker" @view-user-page="navigateToUser"/>
		</template>
		<template #image v-if="marker">
			<component :is="marker.media.type === 'instagram' ? 'Instagram': 'Photo'"
					   :path="marker.media.path" :marker-id="marker.media.id"
					   :alt="`${marker.user.username} | ${marker.description}`"/>
		</template>
		<template #content v-if="marker">
			<ViewMarkerContent :marker="marker"/>
		</template>

		<template #footer v-if="marker">
			<p class="card-footer-item">
				<a @click="$modal.hide('view-marker')">Close</a>
			</p>
			<p class="card-footer-item" v-if="canDelete">
				<button class="button is-danger is-fullwidth" @click="deleteMarker"
						:class="{'is-loading': deleting}">
					Delete
				</button>
			</p>
		</template>
	</SlideUpModal>
</template>

<script>
	import SlideUpModal from "@/Components/Utilities/BaseModal";
	import auth from '@/Services/authentication.service';
	import Photo from '@/Components/Global/Media/Photo';
	import Instagram from '@/Components/Global/Media/Instagram';
	import ViewMarkerHeader from "@/Components/Modals/ViewMarker/Header";
	import ViewMarkerContent from "@/Components/Modals/ViewMarker/Content";

	export default {
		name: "ViewMarker",
		components: {ViewMarkerContent, ViewMarkerHeader, SlideUpModal, Photo, Instagram},
		props: {
			marker: {
				type: Object
			},
		},

		data() {
			return {
				deleting: false,
			}
		},

		methods: {
			async deleteMarker() {
				this.deleting = true;
				const response = await this.$store.dispatch('Markers/delete', this.marker.id);
				this.deleting = false;
				if (response) {
					return this.$modal.hide('view-marker');
				} else {
					this.$toast.error('Please try again at a later time', 'Delete failed.');
				}
			},

			async navigateToUser() {
				this.$modal.hide('view-marker');
				await this.$nextTick;
				this.$router.push(`/${this.marker.user.username}`);
			},
		},

		computed: {
			canDelete() {
				const user = auth.getUserDetails();
				return user && user.id === this.marker.user_id
			},

			routeName() {
				if (!this.marker) {
					return '';
				}
				return `${this.marker.user.username}/${this.marker.id}`;
			}
		},

	}
</script>

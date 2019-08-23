<template>
	<BaseModal :route-name="routeName" v-model="modal">
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
				<a @click="modal = false">Close</a>
			</p>
			<p class="card-footer-item" v-if="canDelete">
				<button class="button is-danger is-fullwidth" @click="deleteMarker"
						:class="{'is-loading': deleting}">
					Delete
				</button>
			</p>
		</template>
	</BaseModal>
</template>

<script>
	import BaseModal from "@/Components/Utilities/BaseModal";
	import auth from '@/Services/AuthenticationService';
	import Photo from '@/Components/Global/Media/Photo';
	import Instagram from '@/Components/Global/Media/Instagram';
	import ViewMarkerHeader from "@/Components/Modals/ViewMarker/Header";
	import ViewMarkerContent from "@/Components/Modals/ViewMarker/Content";

	export default {
		name: "ViewMarker",
		components: {ViewMarkerContent, ViewMarkerHeader, BaseModal, Photo, Instagram},

		created() {
			this.$bus.$on('marker-click', this.showMarker);
		},
		beforeDestroy() {
			this.$bus.$off('marker-click', this.showMarker);
		},

		data() {
			return {
				deleting: false,
				marker: null,
				modal: false,
			}
		},

		methods: {
			async deleteMarker() {
				this.deleting = true;
				const response = await this.$store.dispatch('Markers/delete', this.marker.id);
				this.deleting = false;
				if (response) {
					this.modal = false;
				} else {
					this.$toast.error('Please try again at a later time', 'Delete failed.');
				}
			},

			async navigateToUser() {
				this.modal = false;
				await this.$nextTick;
				this.$router.push(`/${this.marker.user.username}`);
			},

			showMarker(marker) {
				this.marker = marker;
				this.modal = true;
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

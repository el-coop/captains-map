<template>
	<BaseModal :route-name="routeName" :manage-close-navigation="false" v-model:active="modal" @close="closedNavigation">
		<template #header v-if="marker">
			<ViewMarkerHeader :marker="marker" @view-user-page="navigateToUser"/>
		</template>
		<template #image v-if="marker && marker.media.length">
			<template v-if="marker.media.length > 1">
				<div class="click-pagination"
					 :class="{'click-pagination--visible': showAlbumHint}">
					<div class="click-pagination__button" @click="changeMedia(-1)">Back</div>
					<div class="click-pagination__button" @click="changeMedia(1)">Next</div>
				</div>

				<div class="pagination-indicators">
					<template v-for="(media, mediaIndex) in marker.media">
						<div class="pagination-indicators__indicator" @click="currentMedia = mediaIndex"
							 :class="{'pagination-indicators__indicator--active': currentMedia === mediaIndex}"></div>
					</template>
				</div>
			</template>
			<template v-for="(media, mediaIndex) in marker.media">
				<component v-if="currentMedia === mediaIndex"
						   :is="media.type === 'instagram' ? 'Instagram': 'Photo'"
						   :key="`media_${media.id}`"
						   :path="media.path" :id="media.id"
						   :alt="`${marker.user.username} | ${marker.description}`"/>
			</template>
		</template>
		<template #content v-if="marker">
			<ViewMarkerContent :marker="marker"/>
		</template>

		<template #footer v-if="marker">
			<p class="card__footer-item">
				<a @click="modal = false">Close</a>
			</p>
			<p class="card__footer-item" v-if="canDelete">
				<button class="button is-danger-background is-fullwidth" @click="deleteMarker"
						:class="{'is-loading': deleting}">
					Delete
				</button>
			</p>
		</template>
	</BaseModal>
</template>

<script>
	import BaseModal from "@/Components/Utilities/BaseModal";
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
				userNavigation: false,
				currentMedia: 0,
				showAlbumHint: false
			}
		},

		methods: {
			async deleteMarker() {
				this.deleting = true;
				const response = await this.$store.dispatch('Markers/delete', {
					id: this.marker.id,
					story: this.$route.params.story || null
				});
				this.deleting = false;
				if (response) {
					this.modal = false;
				} else {
					this.$toast.error('Please try again at a later time', 'Delete failed.');
				}
			},

			changeMedia(amount) {
				this.currentMedia += amount;
				if (this.currentMedia < 0) {
					this.currentMedia = this.marker.media.length - 1;
				}
				if (this.currentMedia >= this.marker.media.length) {
					this.currentMedia = 0;
				}
			},

			async navigateToUser() {
				this.modal = false;
				this.userNavigation = true;
			},

			closedNavigation() {
				if (this.userNavigation) {
					this.userNavigation = false;
					return this.$router.push(`/${this.marker.user.username}`);
				}
				if (this.$route.params.story) {
					return this.$router.pushRoute(`${this.$router.currentRoute.params.username}/story/${this.$route.params.story}`);
				}
				if (this.$router.currentRoute.params.username) {
					return this.$router.pushRoute(this.$router.currentRoute.params.username);
				}
				return this.$router.pushRoute(this.$router.currentRoute.path.replace('/', ''));
			},

			showMarker(marker) {
				this.currentMedia = 0;
				this.marker = marker;
				this.modal = true;

				if (marker.media.length > 1) {
					this.showAlbumHint = true;
					setTimeout(() => {
						this.showAlbumHint = false;
					}, 1500);
				}
			},
		},

		computed: {
			canDelete() {
				const user = this.$store.state.User.user;
				return user && user.id === this.marker.user_id
			},

			routeName() {
				if (!this.marker) {
					return '';
				}
				if (this.$route.params.story) {
					return `${this.marker.user.username}/story/${this.$route.params.story}/${this.marker.id}`
				}
				return `${this.marker.user.username}/${this.marker.id}`;
			}
		},

	}
</script>

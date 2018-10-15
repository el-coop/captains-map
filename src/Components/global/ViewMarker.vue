<template>
	<slide-up-modal name="view-marker" :route-name="routeName">
		<template v-if="marker">
			<view-marker-header slot="header" :marker="marker"/>
			<component slot="image" :is="marker.media.type === 'instagram' ? 'Instagram': 'Photo'"
					   :path="marker.media.path" :marker-id="marker.media.id"
					   @instagram-loaded="$bus.$emit('fix-modal')"/>
			<view-marker-content slot="content" :marker="marker"/>

			<template slot="footer">
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
		</template>
	</slide-up-modal>
</template>

<script>
	import SlideUpModal from "./slide-up-modal";
	import Auth from '@/Services/authentication.service';
	import Photo from './media/photo';
	import Instagram from './media/instagram';
	import ViewMarkerHeader from "./viewMarker/header";
	import ViewMarkerContent from "./viewMarker/Content";

	export default {
		name: "view-marker",
		components: {ViewMarkerContent, ViewMarkerHeader, SlideUpModal, Photo, Instagram},
		props: {
			marker: {
				type: Object
			},
		},

		data() {
			return {
				deleting: false
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
					this.$toast.error('Please try again at a later time', 'Delete failed.', {
						timeout: 2000,
						position: 'bottomCenter',
					});
				}
			},

		},

		computed: {
			canDelete() {
				let user = Auth.getUserDetails();
				return user && user.id === this.marker.user_id
			},

			routeName(){
				if(! this.marker){
					return null;
				}
				return `${this.marker.user.username}/${this.marker.id}`;
			}
		},

	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.dashboard__control--dark {
		margin-bottom: 0.2rem;
	}

	hr {
		margin: 0.5rem 0 0;
	}
</style>
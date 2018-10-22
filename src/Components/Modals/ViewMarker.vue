<template>
	<slide-up-modal name="view-marker" :route-name="routeName">
		<template v-if="marker">
			<view-marker-header slot="header" :marker="marker"/>
			<component slot="image" :is="marker.media.type === 'instagram' ? 'instagram': 'photo'"
					   :path="marker.media.path" :marker-id="marker.media.id"/>
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
	import SlideUpModal from "@/Components/Utilities/SlideUpModal";
	import auth from '@/Services/authentication.service';
	import Photo from '../Global/media/photo';
	import Instagram from '../Global/media/instagram';
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
					this.$toast.error('Please try again at a later time', 'Delete failed.');
				}
			},

		},

		computed: {
			canDelete() {
				let user = auth.getUserDetails();
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
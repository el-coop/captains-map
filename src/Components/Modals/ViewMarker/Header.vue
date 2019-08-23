<template>
	<div class="card-header-title">
		<div class="media">
			<div class="media-left view-marker-header__profile">
				<figure class="image is-64x64">
					<img class="view-marker-header__profile-image is-rounded" :src="imageSrc"/>
				</figure>
			</div>
			<div class="media-content">
				<a @click.stop.prevent="linkClicked"
				   class="has-text-white is-size-5" v-text="marker.user.username"/>
				<p class="has-text-weight-normal" v-text="marker.type"/>
				<p class="has-text-weight-light has-text-grey-lighter is-size-6"
				   v-text="dateDisplay"/>
			</div>
		</div>
	</div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';
	import DataDisplay from '@/Components/Utilities/HandlesDataDisplayMixin';

	export default {
		name: "ViewMarkerHeader",
		props: {
			marker: {
				type: Object
			},
			profile: {
				type: Object,
				default() {
					return {
						image: globe
					}
				}
			}
		},

		methods: {
			linkClicked() {
				this.$emit('view-user-page');
			}
		},

		computed: {
			dateDisplay() {
				return DataDisplay.methods.dateDisplay(this.marker.time);
			},

			imageSrc() {
				if (!this.marker.user.bio) {
					return globe;
				}
				return this.marker.user.bio.path ? `/api${this.marker.user.bio.path}` : globe;
			}

		}

	}
</script>

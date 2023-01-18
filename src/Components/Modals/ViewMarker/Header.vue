<template>
	<div class="card__header-title">
		<div class="view-marker__profile">
			<figure class="image view-marker__profile-image">
				<img class="is-rounded" :src="imageSrc"/>
			</figure>
		</div>
		<div>
			<a @click.stop.prevent="linkClicked" class="is-size-5" v-text="marker.user.username"/>
			<p class="has-text-weight-normal" v-text="marker.type"/>
			<p class="has-text-weight-light has-text-muted is-size-6"
			   v-text="dateDisplay"/>
		</div>
	</div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';
	import DataDisplay from '@/Components/Utilities/HandlesDataDisplayMixin.vue';

	export default {
		name: "ViewMarkerHeader",
        emits: ['view-user-page'],
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

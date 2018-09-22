<template>
	<div class="leaflet-bar leaflet-control user-marker-control">
		<a @click="toggleMarker">
			<font-awesome-icon icon="globe"/>
		</a>
	</div>
</template>

<script>
	import leaflet from 'leaflet';
	import MapObjectMixin from '../MapObjectMixin';

	const LControl = leaflet.Control.extend({
		element: undefined,
		onAdd() {
			return this.element;
		},
		setElement(el) {
			this.element = el;
		}
	});

	export default {
		name: "UserMarkerControl",
		mixins: [MapObjectMixin],

		methods: {
			prepareMapObject() {
				this.mapObject = new LControl({position: 'bottomleft'});
				this.mapObject.setElement(this.$el);
			},
			toggleMarker() {
				this.$toast.info(this.message, '', {
					position: 'bottomCenter'
				});
				this.$store.commit('Markers/toggleUserMarker');
			}
		},

		computed: {
			message() {
				if (this.$store.state.Markers.userMarker) {
					return 'Turning off location service.';
				}
				return 'Calculating location, please wait.';
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.user-marker-control {
		margin-bottom: $gap * 0.8;

		@media #{$above-tablet}{
			margin-bottom: 10px;
		}
	}
</style>
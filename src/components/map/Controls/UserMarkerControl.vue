<template>
	<div class="leaflet-bar leaflet-control">
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

<style scoped>

</style>
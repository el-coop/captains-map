<template>
	<div class="leaflet-bar leaflet-control user-marker-control map__marker">
		<a @click="toggleMarker" @contextmenu.stop="goToUserMarker" :class="{active}">
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
			leaflet.DomEvent.on(this.element, 'click', (ev) => {
				leaflet.DomEvent.stopPropagation(ev);
			});
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
					id: 'geolocation-notification',
				});
				this.$store.commit('Markers/toggleUserMarker');
			},
			goToUserMarker() {
				if (this.active) {
					this.$bus.$emit('goToUserMarker');
				}
			}
		},

		computed: {
			active() {
				return this.$store.state.Markers.userMarker;
			},
			message() {
				if (this.active) {
					return 'Turning off location service.';
				}
				return 'Calculating location, please wait.';
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.leaflet-control.user-marker-control {
		margin-bottom: $gap * 0.8;

		@media #{$above-tablet}{
			margin-bottom: 10px;
		}

		& > .active {
			background-color: $link;
		}
	}
</style>
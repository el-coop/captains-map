<template>
	<div class="leaflet-bar leaflet-control map__user-marker-control-wrapper map__marker">
		<a @click="toggleMarker" @contextmenu.stop.prevent="goToUserMarker" :class="{'map__user-marker-control--active' : active}">
			<FontAwesomeIcon icon="globe"/>
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
			leaflet.DomEvent.on(this.element, 'contextmenu', (ev) => {
				leaflet.DomEvent.stopPropagation(ev);
			});
			return this.element;
		},
		setElement(el) {
			this.element = el;
		}
	});

	export default {
		name: "MapUserMarkerControl",
		mixins: [MapObjectMixin],
        emits:['go-to-user-marker'],

		methods: {
			prepareMapObject() {
				this.mapObject = new LControl({position: 'bottomleft'});
				this.mapObject.setElement(this.$el);
			},

			toggleMarker() {
				this.$toast.info(this.message, '', {
					id: 'geolocation-notification',
				});
				this.$store.dispatch('Markers/toggleUserMarker');
			},

			goToUserMarker() {
				if (this.active) {
					this.$emit('go-to-user-marker');
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

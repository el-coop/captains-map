<script>
	import leaflet from 'leaflet';
	import Map from '@/services/leaflet.service';

	export default {
		data() {
			return {
				event: 'marker-click',
				eventPayload: {},
				mapObject: null,
			}
		},

		mounted() {
			this.prepareMapObject();
			if (this.mapObject) {
				this.addToMap();
			}
		},

		beforeDestroy() {
			this.removeFromMap();
		},

		methods: {
			prepareMapObject() {
				this.mapObject = leaflet.marker([29.972156439427465, -90.0618624687195], {
					icon: leaflet.divIcon({
						html: `<div class="map__marker"></div>`,
						iconSize: ['auto', 'auto']
					})
				}).on('click', this.onClick.bind(this));
			},

			addToMap() {
				Map.addMarker(this.mapObject);
			},
			removeFromMap() {
				Map.removeMarker(this.mapObject);
			},
			onClick() {
				this.$bus.$emit(this.event, this.payload);
			}
		}

	}
</script>

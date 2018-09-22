<script>
	import leaflet from 'leaflet';
	import Map from '@/services/leaflet.service';

	export default {
		data() {
			return {
				event: 'marker-click',
				eventPayload: {},
				mapObject: null,
				iconSize: 'auto'
			}
		},

		mounted() {
			this.setUp();
			if (this.mapObject) {
				this.addToMap();
			}
		},

		beforeDestroy() {
			this.removeFromMap();
		},

		methods: {
			setUp() {
				this.prepareMapObject();
			},

			prepareMapObject(lat, lng) {
				lat = this.lat;
				lng = this.lng;
				this.mapObject = leaflet.marker([lat, lng], {
					icon: leaflet.divIcon({
						html: this.$el.outerHTML,
						iconSize: [this.iconSize, this.iconSize]
					})
				}).on('click', this.onClick.bind(this));
			},

			addToMap() {
				Map.addObject(this.mapObject);
			},
			removeFromMap() {
				Map.removeObject(this.mapObject);
			},
			onClick() {
				this.$bus.$emit(this.event, this.payload);
			}
		}

	}
</script>

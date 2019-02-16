<script>
	import MapMarker from "@/Components/Map/Markers/MapMarker";

	export default {
		name: "upload-marker",
		extends: MapMarker,

		props: {
			status: {
				type: String,
				default: 'queued'
			}
		},

		data() {
			return {
				extraClass: `map__marker--${this.status}`
			};
		},

		methods: {
			calculateSrc() {
				return this.calculateUnverifiedImage(this.marker)
			},

			async onClick() {
				if (!this.marker.error) {
					return;
				}
				this.$bus.$emit('map-right-click', {
					lat: this.lat,
					lng: this.lng,
					marker: this.marker,
				});
			}
		},
	}
</script>

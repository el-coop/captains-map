<script>
	import MapMarker from "@/Components/Map/Markers/MapMarker";

	export default {
		name: "MapUploadMarker",
		extends: MapMarker,

		mounted(){
			this.setStatus();
		},

		methods: {
			calculateSrc() {
				return this.calculateUnverifiedImage(this.marker)
			},

			async onClick() {
				if (!this.marker.error) {
					return;
				}
				this.$bus.$emit('map-create-marker', {
					lat: this.lat,
					lng: this.lng,
					marker: this.marker,
				});
			},

			setStatus() {
				if (this.$store.state.Uploads.workingId === this.marker.uploadTime) {
					this.addClass('map__marker--uploading');
					this.removeClass('map__marker--error');
					this.removeClass('map__marker--queued');
				} else if (this.marker.error) {
					this.addClass('map__marker--error');
					this.removeClass('map__marker--uploading');
					this.removeClass('map__marker--queued');
				} else {
					this.addClass('map__marker--queued');
					this.removeClass('map__marker--error');
					this.removeClass('map__marker--uploading');
				}
			}
		},

		watch: {
			'$store.state.Uploads.workingId'() {
				this.setStatus();
			},

			'marker.error'() {
				this.setStatus();
			}
		}
	}
</script>

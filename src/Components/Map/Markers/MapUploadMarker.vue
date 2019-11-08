<script>
	import leaflet from 'leaflet';
	import MapMarker from "@/Components/Map/Markers/MapMarker";

	export default {
		name: "MapUploadMarker",
		extends: MapMarker,

		mounted() {
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
					this.removeClass('map__marker--error');
					this.removeClass('map__marker--queued');
					setTimeout(() => {
						this.addClass('map__marker--uploading');
					},0);
				} else if (this.marker.error) {
					this.removeClass('map__marker--uploading');
					this.removeClass('map__marker--queued');
					setTimeout(() => {
						this.addClass('map__marker--error');
					},0);
				} else {
					this.removeClass('map__marker--error');
					this.removeClass('map__marker--uploading');
					setTimeout(() => {
						this.addClass('map__marker--queued');
					},0);
				}
			}
		},

		watch: {
			'$store.state.Uploads.workingId'() {
				this.setStatus();
			},

			async 'marker.media'() {
				this.src = this.calculateUnverifiedImage(this.marker);
				await this.$nextTick();
				this.setIcon(
					leaflet.divIcon({
						html: this.$el.outerHTML,
						iconSize: [this.iconSize, this.iconSize]
					})
				);
			},

			'marker.error'() {
				this.setStatus();
			}
		}
	}
</script>

<script>
	export default {
		props: {
			editMode: {
				type: Boolean,
				default: false
			}
		},

		data() {
			return {
				latLng: {},
				selectedMarker: null,
				openSidebar: false,
				mountModal: false
			}
		},

		created() {
			this.$bus.$on('moving-map', this.closeSidebar);
			this.$bus.$on('marker-click', this.showMarker);
			this.$bus.$on('map-right-click', this.createMarker);
			this.$bus.$on('user-marker-click', this.createMarker);
		},
		beforeDestroy() {
			this.$bus.$off('marker-click', this.showMarker);
			this.$bus.$off('moving-map', this.closeSidebar);
			this.$bus.$off('map-right-click', this.createMarker);
			this.$bus.$off('marker-click', this.showMarker);
		},

		methods: {
			showMarker(marker) {
				this.selectedMarker = marker;
				this.$modal.show('view-marker');
			},

			closeSidebar() {
				this.openSidebar = false;
			},

			createMarker(data) {
				if (!this.editMode) {
					return;
				}
				if (data.lat && data.lng) {
					this.latLng = data;
				} else {
					this.latLng = data.event.latlng;
				}
				this.$modal.show('create-marker');
			},

		},
	}
</script>

<script>
	export default {
		data() {
			return {
				selectedMarker: null,
				openSidebar: false,
				mountModal: false
			}
		},

		created() {
			this.$bus.$on('moving-map', this.closeSidebar);
			this.$bus.$on('marker-click', this.showMarker);
		},
		beforeDestroy() {
			this.$bus.$off('marker-click', this.showMarker);
			this.$bus.$off('moving-map', this.closeSidebar);
		},

		methods: {
			showMarker(marker) {
				this.selectedMarker = marker;
				this.$modal.show('view-marker');
			},

			closeSidebar() {
				this.openSidebar = false;
			}
		},
	}
</script>

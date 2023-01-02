<script>
	export default {
		name: "LoadsMarkersMixin",

		created() {
			this.$_envSetup();
			this.envSetup();
			this.loadMarkers();
		},

		methods: {
			$_envSetup() {
				this.$emit('env-setup');
				this.$store.commit('Markers/setBorders', false);
			},

			async loadMarkers() {
				const response = await this.$store.dispatch('Markers/load', this.payload || false);
				if (response.status === 404) {
                    return this.$emit('404');
				}
				
				if (response.status === 'cached') {
					this.$toast.info('Markers loaded from cache', '');
				}

				this.markersLoaded(response);
			}
		}
	}
</script>

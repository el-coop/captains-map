<script>
	export default {
		data() {
			return {
				event: 'user-marker-click',
			}
		},

		computed: {
			payload() {
				return {
				    latlng: {
                        lng: this.lng,
                        lat: this.lat
                    }
				}
			}
		}
	}
</script>

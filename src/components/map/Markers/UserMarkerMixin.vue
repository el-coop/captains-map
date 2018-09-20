<script>
	import leaflet from 'leaflet';
	import Map from '@/services/leaflet.service';

	export default {
		data() {
			return {
				event: 'user-marker-click',
			}
		},

		computed: {
			payload() {
				return {
					lng: this.lng,
					lat: this.lat
				}
			}
		}
	}
</script>

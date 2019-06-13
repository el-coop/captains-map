<script>
	import MarkerEntry from "@/Components/Dashboard/SideBar/MarkerEntry";

	export default {
		name: "UploadEntry",
		extends: MarkerEntry,

		data() {
			return {
				className: null
			}
		},

		methods: {
			calculateImage() {
				return this.calculateUnverifiedImage(this.marker);
			},

			setStatus() {
				if (this.$store.state.Uploads.workingId === this.marker.uploadTime) {
					this.className = 'uploading';
					return;
				}
				this.className = this.marker.error ? 'error' : 'queued';
			}
		},

		watch: {
			'$store.state.Uploads.workingId': {
				handler() {
					this.setStatus();
				},
				immediate: true
			},

			'marker.error'() {
				this.setStatus();
			}
		}

	}
</script>

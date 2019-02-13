<script>
	import MarkerEntry from "@/Components/Dashboard/SideBar/MarkerEntry";

	export default {
		name: "upload-entry",
		extends: MarkerEntry,

		data() {
			return {
				className: null
			}
		},

		created() {
			if (this.$store.state.Uploads.workingId === this.marker.uploadTime) {
				this.className = 'uploading';
				return;
			}
			this.className = this.marker.error ? 'error' : 'queued';
		},

		methods: {
			calculateImage() {
				return this.calculateUnverifiedImage(this.marker);
			},
		},

		watch: {
			'$store.state.Uploads.workingId'(value) {
				if (value === this.marker.uploadTime) {
					this.className = 'uploading';
					return;
				}
				this.className = this.marker.error ? 'error' : 'queued';
			},

			'marker.error'(value) {
				if (this.$store.state.Uploads.workingId === this.marker.uploadTime) {
					this.className = 'uploading';
					return;
				}
				this.className = this.marker.error ? 'error' : 'queued';
			}
		}

	}
</script>

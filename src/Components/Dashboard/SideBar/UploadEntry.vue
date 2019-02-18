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
			this.setStatus();
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
			'$store.state.Uploads.workingId'() {
				this.setStatus();
			},

			'marker.error'() {
				this.setStatus();
			}
		}

	}
</script>

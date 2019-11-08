<script>
	import MarkerEntry from "@/Components/Dashboard/SideBar/MarkerEntry";
	import globe from '../../../assets/images/globe-icon.png';

	export default {
		name: "UploadEntry",
		extends: MarkerEntry,

		data() {
			return {
				className: null,
				user: this.$store.state.Profile.user,
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

		computed: {
			progress() {
				return this.$store.state.Uploads.progress || 0;
			},
			profileImg() {
				return this.user.path ? `/api${this.user.path}` : globe;
			},
			uploadingStyle() {
				if (this.className !== 'uploading') {
					return '';
				}
				if (!this.progress) {
					return `filter: grayscale(100%)`;
				}
				return `filter: grayscale(${100 - this.progress}%)`;

			}
		},

		watch: {
			'$store.state.Uploads.workingId': {
				immediate: true,
				handler() {
					this.setStatus();
				}
			},

			'marker.media'() {
				this.src = this.calculateUnverifiedImage(this.marker);
			},

			'marker.error'() {
				this.setStatus();
			}
		}

	}
</script>

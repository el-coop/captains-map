<script>
	import MarkerEntry from "@/Components/Dashboard/SideBar/MarkerEntry";

	export default {
		name: "upload-entry",
		extends: MarkerEntry,

		data() {
			return {
				className: this.marker.error ? 'error' : 'queued'
			}
		},

		methods: {
			calculateImage() {
				return this.calculateUnverifiedImage(this.marker);
			},
		}
	}
</script>

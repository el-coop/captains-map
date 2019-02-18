<script>
	export default {
		props: {
			headers: {
				default() {
					return {
						'Content-type': 'application/json'
					};
				},
				type: Object
			},
		},

		methods: {
			getData() {
				let data = new FormData(this.$el);
				for (let prop in this.extraData) {
					if (this.extraData.hasOwnProperty(prop)) {
						data.append(prop, this.extraData[prop])
					}
				}
				if (this.headers['Content-type'] === 'application/json') {
					return this.jsonify(data);
				}
				return data;
			},

			jsonify(formData) {
				let data = {};
				formData.forEach((value, key) => {
					data[key] = value;
				});
				return data;
			},
		}
	}
</script>


<script>
	export default {
		name: "FieldMixin",
		props: {
			value: {
				type: String,
				default: ''
			},
			error: {
				type: String,
				default: ''
			},
			label: {
				type: String,
				default: ''
			},
			placeholder: {
				type: String,
				default: ''
			},
			name: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				inputId: `label_${this._uid}`
			}
		},

		computed: {
			val: {
				get() {
					return this.value;
				},
				set(value) {
					this.$emit('input', value);
				}
			}
		}
	}
</script>

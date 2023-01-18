<script>
	export default {
		name: "FieldMixin",
        emits: ['update:modelValue'],
        props: {
			modelValue: {
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
					return this.modelValue;
				},
				set(value) {
					this.$emit('update:modelValue', value);
				}
			}
		}
	}
</script>

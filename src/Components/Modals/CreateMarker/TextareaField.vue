<template>
	<div class="field">
		<label class="label" v-if="label" :for="inputId" v-text="label"/>
		<div class="control">
			<textarea :id="inputId" class="textarea" v-model="val" :placeholder="placeholder"
					  :name="name"/>
			<p class="help is-danger" v-if="error" v-text="error"/>
		</div>
	</div>
</template>

<script>
	export default {
		name: "TextareaField",

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
			type: {
				type: String,
				default: 'text'
			}
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

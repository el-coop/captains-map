<template>
	<div class="field">
		<label class="label" v-if="label" :for="inputId" v-text="label"/>
		<div class="control">
			<input :type="type" :id="inputId" class="input" v-model="path" :placeholder="placeholder"
				   :name="name">
			<p class="help is-danger" v-if="error" v-text="error"/>
		</div>
	</div>
</template>

<script>
	export default {
		name: "TextField",

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
			},
		},

		data() {
			return {
				inputId: `label_${this._uid}`
			}
		},


		computed: {
			path: {
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

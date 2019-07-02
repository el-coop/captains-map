<template>
	<div class="field">
		<label :for="inputId" class="label" v-text="label" v-if="label"/>
		<div class="select">
			<select :id="inputId" :name="name" v-model="type">
				<option v-for="(option, key) in options" :value="key"
						v-text="option"/>
			</select>
		</div>
		<p class="help is-danger" v-if="error" v-text="error"/>
	</div>
</template>

<script>
	export default {
		name: "SelectField",

		props: {
			value: {
				type: String,
				default() {
					return null;
				}
			},
			error: {
				type: String,
				default: ''
			},
			options: {
				type: Object,
				required: true
			},
			name: {
				type: String,
				default: ''
			},
			label: {
				type: String,
				default: ''
			}
		},


		data() {
			return {
				inputId: `label_${this._uid}`
			}
		},

		computed: {
			type: {
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

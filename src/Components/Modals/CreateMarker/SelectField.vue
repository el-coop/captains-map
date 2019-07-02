<template>
	<div class="field">
		<label for="type" class="label" v-text="label" />
		<div class="select">
			<select id="type" name="type" v-model="type">
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
			label: {
				type: String,
				required: true
			}
		},

		data() {
			return {
				markerTypes: [
					'Visited',
					'Plan',
					'Suggestion',
					'Other'
				]

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

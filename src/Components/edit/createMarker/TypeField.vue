<template>
	<div class="field">
		<label for="type" class="label">Type</label>
		<div class="select">
			<select id="type" name="type" v-model="type">
				<option v-for="(markerType) in markerTypes" :value="markerType"
						v-text="markerType"></option>
			</select>
		</div>
		<p class="help is-danger" v-if="error">Invalid marker type.</p>
	</div>
</template>

<script>
	export default {
		name: "create-marker-type-field",

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

<style scoped>

</style>
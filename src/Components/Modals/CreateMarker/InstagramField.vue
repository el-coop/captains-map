<template>
	<div class="field">
		<label class="label" for="instagram">Instagram Link</label>
		<div class="control">
			<input type="text" id="instagram" class="input" v-model="path"
				   name="media[path]">
			<p class="help is-danger" v-if="error">You most give a valid instagram
				link.</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: "create-marker-instagram-field",

		props: {
			value: {
				type: String,
				default: ''
			},
			error: {
				type: String,
				default: ''
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

<style scoped>

</style>
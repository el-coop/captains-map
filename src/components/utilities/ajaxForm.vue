<template>
    <form @submit.prevent="submit">
        <slot name="errors"></slot>
        <slot></slot>
    </form>
</template>

<script>
	export default {
		name: "ajax-form",

		props: {
			method: {
				default: 'post',
				type: String
			},
			headers: {
				default() {
					return {};
				},
				type: Object
			},
			extraData: {
				default() {
					return {};
				},
				type: Object
			}
		},

		data() {
			return {
				errors: {}
			}
		},
		methods: {
			getData() {
				let data = new FormData(this.$el);
				for (let prop in this.extraData) {
					if (this.extraData.hasOwnProperty(prop)) {
						data.append(prop, this.extraData[prop])
					}
				}
				return data;
			},

			async submit() {
				this.clearErrors();
				this.$emit('submitting');
				let request = await this.$http[this.method]('marker/create', this.getData(), this.headers);
				this.$emit('submitted', request);
				if (request.hasOwnProperty('response') && request.response.data.errors) {
					this.formatErrors(request.response.data.errors);
				}
			},

			formatErrors(errors) {
				errors.forEach((error) => {
					this.errors[error.param] = error.msg;
				});
				this.$emit('errors', this.errors);
			},


			clearErrors(errors) {
				this.errors = {};
				this.$emit('errors', this.errors);
			}
		},
	}
</script>

<style scoped>

</style>
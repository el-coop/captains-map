<template>
	<form @submit.prevent="submit">
		<slot name="errors"></slot>
		<slot></slot>
	</form>
</template>

<script>
	import FormDataMixin from '@/Components/Utilities/FormDataMixin';

	export default {
		name: "ajax-form",
		mixins: [
			FormDataMixin
		],

		props: {
			method: {
				default: 'post',
				type: String
			},
			action: {
				type: String,
				default: window.location
			},
			extraData: {
				default() {
					return {};
				},
				type: Object
			},
		},

		data() {
			return {
				errors: {}
			}
		},
		methods: {
			async submit() {
				this.clearErrors();
				this.$emit('submitting');
				let response = await this.$http[this.method](this.action, this.getData(), this.headers);
				this.$emit('submitted', response);
				if (response.data.errors) {
					return this.formatErrors(response.data.errors);
				}
				if (response.status !== 200) {
					return;
				}
				this.$el.reset();
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

<template>
	<div class="field is-grouped has-text-centered" v-else>
		<div class="control is-expanded">
			<button class="button is-dark is-fullwidth" @click="$modal.show('login')">Log in</button>
			<login-modal/>
		</div>
		<div class="control is-expanded">
			<button class="button is-dark is-fullwidth" @click="$modal.show('register')">Register</button>
			<register-modal/>
		</div>
	</div>
</template>

<script>
	import LoginModal from "@/Components/Modals/LoginModal";
	import RegisterModal from "@/Components/Modals/RegisterModal";

	export default {
		name: "LoggedOutBar",
		components: {
			LoginModal,
			RegisterModal
		}
	}
</script>

<style lang="scss" scoped>

	@import "~$scss/variables";

	.field.is-grouped {
		height: 100%;
		align-items: center;
		padding: 0 2px;

		@media #{$above-tablet} {
			margin-left: auto;
			padding: 0 20px;
			max-width: 20vw;
		}
	}
</style>
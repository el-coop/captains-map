<template>
	<div class="dashboard__control dashboard__control--dark">
		<div class="field has-addons has-text-centered" v-if="loggedIn">
			<div class="control is-expanded">
				<button class="button is-dark is-fullwidth" @click="$router.push('/edit')">Dashboard</button>
			</div>
			<logout/>
		</div>
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
	</div>
</template>

<script>
	import LoginModal from "./LoginModal";
	import RegisterModal from "./RegisterModal";
	import Auth from '@/Services/authentication.service';
	import Logout from "@/Components/global/topBar/Logout";

	export default {
		components: {Logout, RegisterModal, LoginModal},
		name: "top-bar",

		computed: {
			loggedIn() {
				return Auth.isLoggedIn();
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.field {
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
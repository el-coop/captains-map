<template>
	<div class="dashboard__control dashboard__control--dark">
		<div v-if="loggedIn" class="topbar-flex">
			<div></div>
			<search-bar/>
			<div class="field has-addons has-text-centered side-buttons" v-if="loggedIn">
				<div class="control is-expanded">
					<button class="button is-dark is-fullwidth" @click="$router.push('/edit')"
							v-if="$router.currentRoute.name === 'view'">Dashboard
					</button>
					<button class="button is-dark is-fullwidth" @click="$router.push('/')"
							v-if="$router.currentRoute.name === 'edit'">Map Feed
					</button>
				</div>
				<logout/>
			</div>
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
	import Logout from "@/Components/Global/topBar/Logout";
	import SearchBar from "@/Components/edit/SearchBar";

	export default {
		components: {SearchBar, Logout, RegisterModal, LoginModal},
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

	.topbar-flex {
		height: 100%;
		padding: 0 2px;
		display: flex;
		justify-content: center;
		align-items: stretch;
		flex-direction: column;

		@media #{$above-tablet} {
			justify-content: space-between;
			align-items: center;
			flex-direction: row;
		}
	}

	.field.has-addons.side-buttons {
		padding-right: 10px;
		padding-left: 10px;
		@media #{$above-tablet} {
			width: 20vw;
			padding-right: 20px;
			padding-left: 0;
			margin-top: 0;
		}
	}
</style>
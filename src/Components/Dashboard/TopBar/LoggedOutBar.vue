<template>
	<TheTopBar>
		<template #right>
			<div class="buttons is-marginless">
				<button class="button is-light is-outlined is-borderless is-marginless is-light-hover"
						@click="loginModal = true">
					<span class="icon is-small">
						<font-awesome-icon icon="sign-in-alt"/>&nbsp;
					</span>
					<span class="is-size-7">Log In</span>
				</button>
				<button class="button is-light is-outlined is-borderless is-marginless is-light-hover"
						@click="registerModal = true">
					<span class="is-size-7">Register</span>
				</button>
			</div>
			<LoginModal v-model="loginModal"/>
			<RegisterModal v-model="registerModal"/>
		</template>
	</TheTopBar>
</template>

<script>
	import LoginModal from "@/Components/Modals/LoginModal";
	import RegisterModal from "@/Components/Modals/RegisterModal";
	import TheTopBar from "@/Components/Dashboard/TopBar/TheTopBar";

	export default {
		name: "LoggedOutBar",
		components: {
			TheTopBar,
			LoginModal,
			RegisterModal
		},

		data() {
			return {
				loginModal: false,
				registerModal: false,
			};
		}
	}
</script>

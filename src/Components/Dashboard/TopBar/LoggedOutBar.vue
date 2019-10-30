<template>
	<TheTopBar>
		<template #right>
			<div class="buttons">
				<button class="button"
						@click="loginModal = true">
					<span class="icon">
						<font-awesome-icon icon="sign-in-alt" fixed-width/>&nbsp;
					</span>
					<span class="is-size-7">Log In</span>
				</button>
				<button class="button"
						@click="registerModal = true">
					<span class="is-size-7">Register</span>
				</button>
			</div>
			<LoginModal :active.sync="loginModal"/>
			<RegisterModal :active.sync="registerModal"/>
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

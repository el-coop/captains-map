<template>
	<top-bar>
		<template #right>
			<div class="buttons is-marginless">
				<button class="button is-light is-outlined is-borderless is-marginless is-light-hover"
						@click="$modal.show('login')">
					<span class="icon is-small">
						<font-awesome-icon icon="sign-in-alt"/>&nbsp;
					</span>
					<span class="is-size-7">Log In</span>
				</button>
				<button class="button is-light is-outlined is-borderless is-marginless is-light-hover"
						@click="$modal.show('register')">
					<span class="is-size-7">Register</span>
				</button>
				<login-modal/>
				<register-modal/>
			</div>
		</template>
	</top-bar>
</template>

<script>
	import LoginModal from "@/Components/Modals/LoginModal";
	import RegisterModal from "@/Components/Modals/RegisterModal";
	import TopBar from "@/Components/Dashboard/TopBar/TopBar";

	export default {
		name: "LoggedOutBar",
		components: {
			TopBar,
			LoginModal,
			RegisterModal
		}
	}
</script>

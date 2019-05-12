<template>
	<button class="logout__button button is-danger is-outlined is-marginless is-borderless" @click="logout">
		<span class="icon">
			<FontAwesomeIcon icon="sign-out-alt"/>
		</span>
	</button>
</template>

<script>
	export default {
		name: "Logout",

		methods: {
			async logout() {
				await this.$store.dispatch('User/logout');
			}
		}
	}
</script>

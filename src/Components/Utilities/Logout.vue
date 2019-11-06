<template>
	<button class="button button--logout is-danger" @click="logout">
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

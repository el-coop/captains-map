<template>
	<button class="button is-danger is-outlined is-marginless is-borderless" @click="logout">
		<span class="icon">
			<font-awesome-icon icon="sign-out-alt"/>
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

<style lang="scss" scoped>
	@import "~$scss/variables";

	.control {
		width: 80px;
	}

	button {
		background-color: $grey-darker;

		&:hover {
			color: $text !important;
		}
	}
</style>

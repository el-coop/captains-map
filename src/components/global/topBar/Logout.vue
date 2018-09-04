<template>
	<div class="control">
		<button class="button is-danger is-outlined is-fullwidth" @click="logout">
			<span class="icon">
				<font-awesome-icon icon="power-off"/>
			</span>
		</button>
	</div>
</template>

<script>
	export default {
		name: "Logout",

		methods: {
			logout(){
				this.$store.dispatch('User/logout');
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
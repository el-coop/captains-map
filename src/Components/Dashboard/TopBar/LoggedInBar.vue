<template>
	<div class="topbar-flex">
		<div class="is-hidden-touch"></div>
		<search-bar/>
		<div class="field has-addons has-text-centered side-buttons">
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
</template>

<script>
	import Logout from "@/Components/Utilities/Logout";
	import SearchBar from "@/Components/Dashboard/TopBar/SearchBar";

	export default {
		name: "LoggedInBar",
		components: {
			Logout,
			SearchBar
		}
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.topbar-flex {
		height: 100%;
		padding: 0;
		display: flex;
		align-items: stretch;
		flex-direction: column;

		@media #{$above-tablet} {
			justify-content: space-between;
			align-items: center;
			flex-direction: row;
			padding: 0 2px;
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
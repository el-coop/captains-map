<template>
	<top-bar>
		<template slot="left">
			<div class="drawer-mobile" :class="{'drawer-mobile--open' : drawerOpen}">
				<button class="button is-danger is-outlined is-marginless is-borderless is-hidden-tablet"
						@click="drawerOpen=false">
					<span class="icon">
						<font-awesome-icon icon="times-circle"/>
					</span>
				</button>
				<search-bar/>
			</div>
		</template>
		<template slot="right">
			<div class="buttons is-marginless">
				<button class="button is-light is-outlined is-borderless is-marginless is-light-hover is-hidden-tablet"
						@click="drawerOpen = true">
					<span class="icon is-small">
						<font-awesome-icon icon="search"/>&nbsp;
					</span>
					<span class="is-size-7">Search</span>
				</button>
				<button class="button is-light is-outlined is-borderless is-marginless is-light-hover"
						:disabled="$router.currentRoute.path === '/edit'"
						@click="$router.push('/edit')">
					<span class="icon is-small">
					<font-awesome-icon icon="user-alt"/>
					</span>
					<span class="is-size-7" v-text="username"></span>
				</button>
				<button class="button is-light is-outlined is-borderless is-marginless is-light-hover"
						:disabled="$router.currentRoute.path === '/'"
						@click="$router.push('/')">
					<span class="icon is-small">
						<font-awesome-icon icon="globe"/>
					</span>
					<span class="is-size-7">Home</span>
				</button>
				<logout/>
			</div>
		</template>
	</top-bar>
</template>

<script>
	import Logout from "@/Components/Utilities/Logout";
	import SearchBar from "@/Components/Dashboard/TopBar/SearchBar";
	import auth from '@/Services/authentication.service';
	import TopBar from "@/Components/Dashboard/TopBar/TopBar";

	export default {
		name: "LoggedInBar",
		components: {
			TopBar,
			Logout,
			SearchBar
		},

		data() {
			return {
				drawerOpen: false
			};
		},

		computed: {
			username() {
				return auth.getUserDetails().username;
			},
		}
	}
</script>

<style scoped lang="scss">
	@import "~$scss/variables";

	.drawer-mobile {
		position: absolute;
		top: 0;
		height: 100%;
		width: 100%;
		z-index: 100;
		transform: translateX(100%);
		background-color: transparentize(whitesmoke, 0.05);
		transition: transform 0.3s;
		display: flex;

		&--open {
			transform: translateX(0%);

			& > .button {
				height: 100%;
			}
		}

		@media (min-width: $tablet) {
			transform: none;
			position: static;
			width: auto;
			background-color: transparent;
		}
	}

	.buttons {
		width: 100%;

		@media (min-width: $tablet) {
			width: auto;
		}

		> .button {
			flex: 1;
			height: 100%;
		}
	}
</style>

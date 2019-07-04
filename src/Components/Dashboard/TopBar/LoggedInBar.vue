<template>
	<TopBar>

		<template #left>
			<DrawerMobile ref="searchBar">
				<SearchBar/>
			</DrawerMobile>
		</template>

		<template #right>
			<div class="buttons is-marginless">
				<button class="button is-light is-outlined is-borderless is-marginless is-light-hover is-hidden-tablet"
						@click="$refs.searchBar.open()">
					<span class="icon is-small">
						<FontAwesomeIcon icon="search"/>&nbsp;
					</span>
					<span class="is-size-7">Search</span>
				</button>
				<button class="button is-light is-outlined is-borderless is-marginless is-light-hover"
						:disabled="isEdit"
						@click="$router.push('/edit')">
					<span class="icon is-small">
						<FontAwesomeIcon icon="user-alt"/>
					</span>
					<span class="is-size-7" v-text="username"></span>
				</button>
				<button class="button is-light is-outlined is-borderless is-marginless is-light-hover"
						:disabled="! hasUser"
						@click="$router.push('/')">
					<span class="icon is-small">
						<FontAwesomeIcon icon="globe"/>
					</span>
					<span class="is-size-7">Home</span>
				</button>
				<Logout/>
			</div>
		</template>

	</TopBar>
</template>

<script>
	import Logout from "@/Components/Utilities/Logout";
	import SearchBar from "@/Components/Dashboard/TopBar/SearchBar";
	import auth from '@/Services/AuthenticationService';
	import TopBar from "@/Components/Dashboard/TopBar/TheTopBar";
	import DrawerMobile from "@/Components/Utilities/DrawerMobile";

	export default {
		name: "LoggedInBar",
		components: {
			DrawerMobile,
			TopBar,
			Logout,
			SearchBar
		},

		computed: {
			username() {
				return auth.getUserDetails().username;
			},

			hasUser() {
				return this.$store.state.Markers.username;
			},

			isEdit() {
				return this.$router.currentRoute.path === '/edit'
			}
		}
	}
</script>

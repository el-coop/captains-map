<template>
	<div class="dashboard__control dashboard__control--dark">
		<logged-in-bar v-if="loggedIn"/>
		<logged-out-bar v-else/>
	</div>
</template>

<script>
	import Auth from '@/Services/authentication.service';
	import LoggedInBar from "@/Components/Dashboard/TopBar/LoggedInBar";
	import LoggedOutBar from "@/Components/Dashboard/TopBar/LoggedOutBar";

	export default {
		components: {LoggedOutBar, LoggedInBar},
		name: "top-bar",

		computed: {
			loggedIn() {
				return Auth.isLoggedIn();
			}
		}
	}
</script>

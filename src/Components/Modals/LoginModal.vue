<template>
	<BaseModal name="login" route-name="">
		<template #header>
			<p class="card-header-title">Login</p>
		</template>
		<template #content>
			<TextField label="Username"
					   placeholder="Username"
					   v-model="form.username"
					   :error="error ? 'The credentials are invalid' : ''"/>
			<TextField label="Password"
					   placeholder="Password"
					   type="password"
					   v-model="form.password"/>
		</template>
		<template #footer>
			<p class="card-footer-item">
				<span>
					<a href="#" @click="$modal.hide('login')">Close</a>
				</span>
			</p>
			<p class="card-footer-item">
				<button class="button is-primary is-fullwidth" @click="login"
						:class="{'is-loading': loading}">
					Submit
				</button>
			</p>
		</template>
	</BaseModal>
</template>

<script>
	import BaseModal from "@/Components/Utilities/BaseModal";
	import TextField from "@/Components/Modals/CreateMarker/TextField";

	export default {
		components: {TextField, BaseModal},
		name: "LoginModal",

		data() {
			return {
				loading: false,
				form: {
					username: '',
					password: ''
				},
				error: false
			}
		},

		methods: {
			async login() {
				this.loading = true;
				this.error = false;
				let loggedIn = await this.$store.dispatch('User/login', this.form);
				this.loading = false;
				if (!loggedIn) {
					this.error = true;
					return;
				}
				this.$router.push('/edit');
			}
		}
	}
</script>

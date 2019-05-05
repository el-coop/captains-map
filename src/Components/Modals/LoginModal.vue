<template>
	<slide-up-modal name="login" route-name="">
		<template #header>
			<p class="card-header-title">Login</p>
		</template>
		<template #content>
			<div class="field">
				<label>Username</label>
				<div class="control">
					<input class="input is-success" type="text" placeholder="Username" v-model="form.username" required>
				</div>
				<p class="help is-danger" v-if="error">The credentials are invalid</p>
			</div>
			<div class="field">
				<label>Password</label>
				<p class="control">
					<input class="input" type="password" placeholder="Password" v-model="form.password" required>
				</p>
			</div>
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
	</slide-up-modal>
</template>

<script>
	import AjaxForm from "@/Components/Utilities/AjaxForm";
	import SlideUpModal from "@/Components/Utilities/BaseModal";

	export default {
		components: {SlideUpModal, AjaxForm},
		name: "login-modal",

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

<style scoped>

</style>

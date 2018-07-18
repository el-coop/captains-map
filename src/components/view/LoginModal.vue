<template>
    <modal name="login" :adaptive="true" :height="'auto'">
        <ajax-form class="dashboard__control box" method="post" action="auth/login"
                   @submitting="loading = true; error = false"
                   @submitted="handleLoginRequest">
            <div class="field">
                <label>Username</label>
                <div class="control">
                    <input class="input is-success" type="text" placeholder="Username" name="username" required>
                </div>
                <p class="help is-danger" v-if="error">The credentials are invalid</p>
            </div>
            <div class="field">
                <label>Password</label>
                <p class="control">
                    <input class="input" type="password" placeholder="Password" name="password" required>
                </p>
            </div>
            <div class="field is-grouped">
                <p class="control is-expanded">
                    <button class="button is-dark is-fullwidth" @click="$modal.hide('login')">Close</button>
                </p>
                <p class="control is-expanded">
                    <button class="button is-danger is-fullwidth" type="submit"
                            :class="{'is-loading': loading}">
                        Submit
                    </button>
                </p>
            </div>
        </ajax-form>
    </modal>
</template>

<script>
	import AjaxForm from "@/components/utilities/ajaxForm";
	import Auth from '@/services/authentication.service'

	export default {
		components: {AjaxForm},
		name: "login-modal",

		data() {
			return {
				loading: false,
				error: false
			}
		},

		methods: {
			handleLoginRequest(response) {
				this.loading = false;
				if (response.status !== 200) {
					this.error = true;
					return;
				}
				Auth.saveToken(response.data.token);
				console.log(Auth.getUserDetails());
				this.$modal.hide('login');
				this.$router.push('/edit');
			}
		}
	}
</script>

<style scoped>

</style>
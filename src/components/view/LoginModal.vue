<template>
    <ajax-form class="" method="post" action="auth/login"
               @submitting="loading = true; error = false"
               @submitted="handleLoginRequest">
        <slide-up-modal name="login">
            <p slot="header" class="card-header-title">Login</p>
            <template slot="content">
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
            </template>
            <template slot="footer">
                <p class="card-footer-item">
                    <span>
                        <a href="#" @click="$modal.hide('login')">Close</a>
                    </span>
                </p>
                <p class="card-footer-item">
                    <button class="button is-primary is-fullwidth" type="submit"
                            :class="{'is-loading': loading}">
                        Submit
                    </button>
                </p>
            </template>
        </slide-up-modal>

    </ajax-form>
</template>

<script>
	import AjaxForm from "@/components/utilities/ajaxForm";
	import Auth from '@/services/authentication.service'
	import SlideUpModal from "../global/slide-up-modal";

	export default {
		components: {SlideUpModal, AjaxForm},
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
				this.$modal.hide('login');
				this.$router.push('/edit');
			}
		}
	}
</script>

<style scoped>

</style>
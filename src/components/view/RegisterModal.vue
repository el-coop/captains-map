<template>
    <modal name="register" :adaptive="true" :height="'auto'">
        <div class="dashboard__control card">
            <div class="card-content">
                <p class="title">
                    Registration is closed at the moment
                </p>
                <p class="subtitle">
                    But you can apply to beta test.
                </p>
                <p class="content">
                    This is currently still under construction, but we would love to discuss early access or other
                    involvement with the project. You can use the contact form <a
                        href="https://elcoop.io/contact" target="_blank">here</a> and we will answer as soon as
                    possible.
                </p>
            </div>
            <footer class="card-footer">
                <p class="card-footer-item">
      <span>
          <a href="#" @click="$modal.hide('register')">Close</a>
      </span>
                </p>
                <p class="card-footer-item">
      <span>
          <a href="https://elcoop.io/contact" target="_blank">Contact Us</a>
      </span>
                </p>
            </footer>
        </div>
    </modal>
</template>

<script>
	import AjaxForm from "@/components/utilities/ajaxForm";
	import Auth from '@/services/authentication.service'

	export default {
		name: "register-modal",

	}
</script>

<style scoped>

</style>
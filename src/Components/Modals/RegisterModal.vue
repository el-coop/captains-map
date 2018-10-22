<template>
	<slide-up-modal name="register">
		<p slot="header" class="card-header-title">Register</p>
		<template slot="content">
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
		</template>
		<template slot="footer">
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
		</template>
	</slide-up-modal>
</template>

<script>
	import SlideUpModal from "@/Components/Utilities/SlideUpModal";

	export default {
		name: "register-modal",
		components: {SlideUpModal},
	}
</script>
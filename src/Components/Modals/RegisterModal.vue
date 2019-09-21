<template>
	<BaseModal route-name="" :active="active" @update:active="$emit('update:active',$event)">
		<template #header>
			<p class="card-header-title">Register</p>
		</template>
		<template #content>
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
		<template #footer>
			<p class="card-footer-item">
                    <span>
                        <a @click="$emit('update:active',false)">Close</a>
                    </span>
			</p>
			<p class="card-footer-item">
                    <span>
                        <a href="https://elcoop.io/contact" target="_blank">Contact Us</a>
                    </span>
			</p>
		</template>
	</BaseModal>
</template>

<script>
	import BaseModal from "@/Components/Utilities/BaseModal";

	export default {
		name: "RegisterModal",
		components: {BaseModal},

		props: {
			active: {
				type: Boolean,
				default: false
			},
		},
	}
</script>

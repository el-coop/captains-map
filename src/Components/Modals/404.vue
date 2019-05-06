<template>
	<BaseModal name="404" @before-close="$router.push('/')" route-name="404">
		<template #header>
			<p class="card-header-title">404</p>
		</template>
		<template #content>
			<div class="content">
				<h5 class="has-text-centered is-size-5 has-text-white-ter">You uncovered Atlantis! Unfortunately it's
					not on our map.</h5>
			</div>
			<div class="four04-wrapper">
				<img :src="atlantis" class="four04-wrapper__image">
				<img :src="tear" class="four04-wrapper__cover">
			</div>
		</template>
		<template #footer>
			<p class="card-footer-item">
				<span>
					<a @click="$modal.hide('404')">Take me out of here!</a>
				</span>
			</p>
		</template>
	</BaseModal>
</template>

<script>
	import BaseModal from "@/Components/Utilities/BaseModal";
	import atlantis from '@/assets/images/atlantis.jpg';
	import tear from '@/assets/images/tear.png';

	export default {
		name: "NotFound",
		components: {BaseModal},

		data() {
			return {
				atlantis,
				tear,
			}
		},
	}
</script>


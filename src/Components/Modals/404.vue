<template>
	<BaseModal @close="$router.push('/')" route-name="404" v-model="modal">
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
					<a @click="modal = false">Take me out of here!</a>
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

		mounted() {
			this.$bus.$on('404', this.openModal);
			this.$bus.$on('env-setup', this.closeModal);
		},

		beforeDestroy() {
			this.$bus.$off('404', this.openModal);
			this.$bus.$off('env-setup', this.closeModal);
		},

		data() {
			return {
				atlantis,
				tear,
				modal: false
			}
		},

		methods: {
			openModal() {
				this.modal = true;
			},
			closeModal() {
				this.modal = false;
			}
		}

	}
</script>


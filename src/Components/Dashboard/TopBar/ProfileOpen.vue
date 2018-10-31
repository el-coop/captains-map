<template>
	<button class="button is-light is-outlined is-borderless is-light-hover">
		<figure class="image is-32x32">
			<img class="is-rounded" :src="logo">
		</figure>&nbsp;
		<span class="is-size-7">Profile</span>
	</button>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';

	export default {
		name: "ProfileOpen",
		data() {
			return {
				logo: globe
			}
		},
	}
</script>

<style scoped>

</style>
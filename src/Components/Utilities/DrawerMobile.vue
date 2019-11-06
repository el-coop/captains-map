<template>
	<div class="drawer-mobile" :class="{'drawer-mobile--open' : drawerOpen}">
		<button class="button button--drawer is-danger is-hidden-tablet"
				@click="drawerOpen=false">
			<FontAwesomeIcon icon="times-circle"/>
		</button>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: "DrawerMobile",

		data() {
			return {
				drawerOpen: false
			}
		},

		methods: {
			open() {
				this.drawerOpen = true;
			}
		}
	}
</script>

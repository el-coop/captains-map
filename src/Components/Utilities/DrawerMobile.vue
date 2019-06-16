<template>
	<div class="drawer-mobile" :class="{'drawer-mobile--open' : drawerOpen}">
		<button class="button is-danger is-outlined is-marginless is-borderless is-hidden-tablet"
				@click="drawerOpen=false">
				<span class="icon">
					<FontAwesomeIcon icon="times-circle"/>
				</span>
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

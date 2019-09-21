<template>
	<transition name="fade">
		<div class="modal is-active" v-show="active">
			<div class="modal-background" @click="close"/>
			<transition name="slide-up-opacity">
				<div class="modal-content" v-if="active">
					<div class="card">
						<div class="card-header dashboard__control--dark">
							<slot name="header"/>
							<a class="card-header-icon modal__close" @click="close">
								<span class="icon">
									<FontAwesomeIcon icon="times-circle"/>
								</span>
							</a>
						</div>
						<div class="card-image" v-if="!! $slots.image">
							<slot name="image"/>
						</div>
						<div class="card-content">
							<slot name="content"/>
						</div>
						<footer class="card-footer">
							<slot name="footer"/>
						</footer>
					</div>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>
	export default {
		name: "BaseModal",

		props: {
			active: {
				type: Boolean,
				default: false
			},
			width: {
				type: Number,
				default: 600
			},
			routeName: {
				type: String,
				default: null
			},
			manageCloseNavigation: {
				type: Boolean,
				default: true
			}
		},

		mounted() {
			window.addEventListener('popstate', this.hideOnBack);
		},

		beforeDestroy() {
			window.removeEventListener('popstate', this.hideOnBack);
		},

		methods: {
			close() {
				if (this.routeName !== null && this.manageCloseNavigation) {
					this.$router.back();
				}
				this.$emit('update:active', false);
			},
			hideOnBack() {
				if (this.active) {
					this.$emit('update:active', false);
				}
			},
		},

		watch: {
			active(value) {
				if (value) {
					if (this.routeName !== null) {
						this.$router.pushRoute(this.routeName);
					}
				} else {
					this.$emit('close');
				}
			}
		}
	}
</script>

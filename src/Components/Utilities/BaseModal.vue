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
		model: {
			prop: 'active',
			event: 'change'
		},

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
				this.$router.back();
				this.$emit('change', false);
			},
			hideOnBack() {
				if (this.active) {
					this.$emit('change', false);
				}
			},
		},

		watch: {
			active(value) {
				if (value) {
					let route = this.routeName;
					if (this.routeName === null) {
						route = this.name;
					}
					this.$router.pushRoute(route);
				} else {
					this.$emit('close');
				}
			}
		}
	}
</script>

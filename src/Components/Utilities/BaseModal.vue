<template>
	<VModal :name="name" transition="slide-up-opacity" :height="height" :adaptive="true"
		   :width="width"
		   :scrollable="true"
		   :pivotY="pivotY"
		   @before-open="beforeOpen"
		   @opened="opened"
		   @closed="closed"
		   @before-close="beforeClose"
		   ref="modal">
		<div class="card">
			<div class="card-header dashboard__control--dark">
				<slot name="header"/>
				<a class="card-header-icon v--modal__close" @click="$modal.hide(name)">
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
	</VModal>
</template>

<script>
	export default {
		name: "BaseModal",

		props: {
			name: {
				type: String,
				required: true
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

		data() {
			return {
				pivotY: 0.5,
				height: 'auto',
				isOpen: false
			};
		},

		mounted() {
			window.addEventListener('popstate', this.hideOnBack);
		},

		beforeDestroy() {
			window.removeEventListener('popstate', this.hideOnBack);
		},

		methods: {
			hideOnBack() {
				if (this.isOpen) {
					this.isOpen = false;
					this.$modal.hide(this.name);
				}
			},

			beforeOpen() {
				this.isOpen = true;
				this.$emit('before-open');
				if (window.innerWidth < 769) {
					this.pivotY = 0.001;
				} else {
					this.pivotY = 0.5;
				}
			},
			opened() {
				let route = this.routeName;
				if (this.routeName === null) {
					route = this.name;
				}
				this.$router.pushRoute(route);
			},

			closed() {
				this.$emit('closed');
			},

			beforeClose() {
				if (this.isOpen) {
					this.isOpen = false;
					this.$router.back();
				}
				this.$emit('before-close');
			}
		},
	}
</script>

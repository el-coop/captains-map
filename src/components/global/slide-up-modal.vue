<template>
	<modal :name="name" :transition="transition" :height="height" :adaptive="true"
		   :width="width"
		   :scrollable="true"
		   :pivotY="pivotY"
		   @before-open="beforeOpen"
		   @closed="closed"
		   @before-close="beforeClose"
		   ref="modal">
		<div class="card">
			<div class="card-header dashboard__control--dark">
				<slot name="header"/>
				<a class="card-header-icon" @click="$modal.hide(name)">
                    <span class="icon">
                        <font-awesome-icon icon="times-circle"/>
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
	</modal>
</template>

<script>
	export default {
		name: "slide-up-modal",

		props: {
			name: {
				type: String,
				required: true
			},
			width: {
				type: Number,
				default: 600
			}
		},

		data() {
			return {
				transition: '',
				pivotY: 0.5,
				height: 'auto'
			};
		},

		methods: {
			beforeOpen() {
				this.$emit('before-open');
				if (window.innerWidth < 769) {
					this.transition = 'slide-up';
					this.pivotY = 0.001;
				} else {
					this.transition = 'slide-up';
					this.pivotY = 0.5;
				}
			},

			closed() {
				this.$emit('closed');
			},

			beforeClose() {
				this.$emit('before-close');
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.card {

		a.card-header-icon {
			color: $white-ter;

			&:hover {
				color: $white-bis;
			}
		}
	}
</style>
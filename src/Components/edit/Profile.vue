<template>
	<div class="dashboard__control profile" :class="status">
		<img class="image"
			 @click="setStatus('')"
			 :src="profile.image">
		<!--<div class="field has-addons buttons">-->
		<!--<p class="control" v-if="status === 'open'">-->
		<!--<button class="button">-->
		<!--Save-->
		<!--</button>-->
		<!--</p>-->
		<!--<p class="control">-->
		<!--<button class="button" @click="setStatus('open')" v-html="openButton">-->
		<!--</button>-->
		<!--</p>-->
		<!--<p class="control">-->
		<!--<button class="button" @click="setStatus('closed')">-->
		<!--Min-->
		<!--</button>-->
		<!--</p>-->
		<!--</div>-->
	</div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';

	export default {
		name: "profile",
		props: {
			profile: {
				type: Object,
				default() {
					return {
						image: globe
					}
				}
			}
		},

		data() {
			return {
				status: ''
			}
		},

		computed: {
			openButton() {
				return this.status === 'open' ? 'Close' : 'Edit'
			}
		},

		methods: {
			setStatus(status) {
				if (this.status === 'open' && status === 'open') {
					status = '';
				}
				return this.status = status;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.profile {
		box-shadow: 5px 5px 20px 10px rgba(0, 0, 0, 0.3);
		width: 0;
		height: 0;
		transition: all $animation-speed;
		align-self: start;

		&.open {
			flex: 1;
		}

		@media #{$above-tablet} {
			height: 200px;
			width: 200px;
			overflow: hidden;
			display: flex;
			&.closed {
				width: 20px;
				height: 20px;
				& > .buttons {
					display: none;
				}
			}
			&.open {
				width: auto;
				flex: 1;
				height: 100%;
			}
		}
	}

	.image {
		position: absolute;
		height: 100%;
		max-height: 200px;
		width: auto;
	}

	.buttons {
		z-index: 5;
		align-self: end;
		margin-left: auto;

		.button {
			border-top-right-radius: 0;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}
	}
</style>
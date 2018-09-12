<template>
	<div class="tabs is-toggle is-toggle-rounded is-fullwidth">
		<input type="hidden" name="media[type]" v-model="type"/>
		<ul>
			<li :class="{ 'is-active': type === 'camera'}">
				<a @click="type = 'camera'">
                                <span class="icon">
                                    <font-awesome-icon icon="camera"/>
                                </span>
					<span>Camera</span>
				</a>
			</li>
			<li :class="{ 'is-active': type === 'instagram'}">
				<a @click="type = 'instagram'">
                                <span class="icon">
                                    <font-awesome-icon icon="camera-retro"/>
                                </span>
					<span>Instagram</span>
				</a>
			</li>
			<li :class="{ 'is-active': type === 'image'}">
				<a @click="type = 'image'">
                                <span class="icon is-small">
                                    <font-awesome-icon icon="file-image"/>
                                </span>
					<span>Upload file</span>
				</a>

			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: "create-marker-type-toggle",

		props: {
			value: {
				required: true,
				type: String
			}
		},

		computed: {
			type: {
				get() {
					return this.value
				},
				set(value) {
					this.$emit('input', value);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	@media #{$under-tablet}{
		.tabs > ul {
			width: 100%;
			flex-wrap: wrap;

			> li {
				> a {
					border-radius: 0 !important;
					border-left-width: 2px;
				}
				&:first-child > a {
					border-left-width: 1px;
				}
			}
		}
	}
</style>
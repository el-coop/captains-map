<template>
	<div class="tabs is-toggle is-toggle-rounded is-fullwidth">
		<input type="hidden" name="media[type]" v-model="type"/>
		<ul>
			<li :class="{ 'is-active': type === 'image'}">
				<a @click="type = 'image'">
					<span class="icon is-small">
						<FontAwesomeIcon icon="file-image"/>
					</span>
					<span>Upload file</span>
				</a>

			</li>
			<li :class="{ 'is-active': type === 'instagram'}">
				<a @click="type = 'instagram'">
					<span class="icon">
						<FontAwesomeIcon icon="camera-retro"/>
					</span>
					<span>Instagram</span>
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: "TypeToggle",

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

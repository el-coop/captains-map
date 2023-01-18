<template>
	<div class="tabs">
		<input type="hidden" name="media[type]" v-model.lazy="type"/>
		<a class="tabs__button" :class="{ 'is-active': type === 'image'}" @click="type = 'image'">
				<span class="tabs__button-icon">
					<FontAwesomeIcon icon="file-image"/>
				</span>
			<span>Upload files</span>
		</a>
		<a class="tabs__button" :class="{ 'is-active': type === 'instagram'}" @click="type = 'instagram'">
				<span class="tabs__button-icon">
					<FontAwesomeIcon icon="camera-retro"/>
				</span>
			<span>Instagram</span>
		</a>
	</div>
</template>

<script>
	export default {
		name: "TypeToggle",
        emits: ['update:modelValue'],
        
        props: {
			modelValue: {
				required: true,
				type: String
			}
		},

		computed: {
			type: {
				get() {
					return this.modelValue
				},
				set(value) {
					this.$emit('update:modelValue', value);
				}
			}
		}
	}
</script>

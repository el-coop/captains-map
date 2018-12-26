<template>
	<div class="field">
		<div class="file is-boxed has-name is-light">
			<label class="file-label">
				<input class="file-input" type="file" :name="name" @change="imageSelected" ref="input">
				<span class="file-cta">
					<figure class="image is-max128" v-if="preview">
						<img :src="preview">
					</figure>
					<template v-else>
						<span class="file-icon">
							<font-awesome-icon icon="upload"/>
						</span>
						<span class="file-label">
							Choose an image
						</span>
					</template>
				</span>
				<span class="file-name"
					  v-text="file ? file.name : 'Choose an image'"></span>
			</label>
		</div>
		<p class="help is-danger" v-if="error" v-text="error"></p>
	</div>
</template>

<script>
	export default {
		name: "create-marker-file-field",

		props: {
			value: {
				type: File,
				default() {
					return null;
				}
			},
			error: {
				type: String,
				default: ''
			},
			name: {
				type: String,
				default: 'media[image]'
			},
			initPreview: {
				default: false
			}
		},

		data() {
			return {
				preview: this.initPreview
			}
		},

		methods: {
			imageSelected(event) {
				let file = event.target.files;
				if (file[0]) {
					this.preview = URL.createObjectURL(file[0]);
					return this.file = file[0];
				}

				this.preview = this.initPreview;
				this.file = null;
			},
		},

		computed: {
			file: {
				get() {
					return this.value;
				},
				set(value) {
					this.$emit('input', value);
				}
			}
		},

		watch: {
			value() {
				if (!this.value) {
					this.preview = this.initPreview;
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.image.is-max128 {
		max-height: 128px;
		max-width: 128px;

		> img {
			height: auto;
			width: auto;
			margin: auto;
			max-height: 100%;
			max-width: 100%;
		}
	}

	.file-label {
		margin: auto;
	}
</style>

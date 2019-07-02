<template>
	<div class="field">
		<div class="file is-boxed has-name is-light">
			<label class="file-label file-field">
				<input class="file-input" type="file" :name="name" @change="imageSelected" ref="input">
				<span class="file-cta">
					<figure class="image file-field__image" v-if="preview">
						<img :src="preview" class="file-field__image-img">
					</figure>
					<template v-else>
						<span class="file-icon">
							<FontAwesomeIcon icon="upload"/>
						</span>
						<span class="file-label">
							Choose an image
						</span>
					</template>
				</span>
				<span class="file-name"
					  v-text="file ? file.name : 'Choose an image'"/>
			</label>
		</div>
		<p class="help is-danger" v-if="error" v-text="error"/>
	</div>
</template>

<script>
	export default {
		name: "FileField",

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
			},
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

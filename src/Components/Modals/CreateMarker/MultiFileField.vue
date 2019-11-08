<template>
	<div class="field">
		<label class="dropzone" :class="{'dropzone--empty': ! Object.keys(value).length}">
			<input class="dropzone__input" type="file" :name="name" @change="imageAdded" :multiple="limit > 1"
				   accept="image/*">
			<template v-if="Object.keys(value).length">
				<div v-for="(file,key) in value" :key="key" class="dropzone__preview" @click.prevent="removeImage(key)">
					<img class="dropzone__preview-image" :src="file.preview">
					<div class="dropzone__preview-label">
						<FontAwesomeIcon icon="times-circle" class="dropzone__preview-label-icon"/>
						<span v-text="file.name"/>
					</div>
				</div>
				<div class="dropzone__preview" v-if="Object.keys(value).length < this.limit">
					<span class="dropzone__icon">
						<FontAwesomeIcon icon="upload"/>
					</span>
					<span>
						Add images<br>
						<span v-text="`${this.limit - Object.keys(value).length} Left`"/>
					</span>
				</div>
			</template>
			<template v-else-if="preview">
				<div class="dropzone__preview">
					<img class="dropzone__preview-image" :src="preview">
					<div class="dropzone__preview-label">
						<span class="dropzone__preview-label-text">Click to upload</span>
					</div>
				</div>
			</template>
			<template v-else>
				<span class="dropzone__icon">
					<FontAwesomeIcon icon="upload"/>
				</span>
				<span>
					Add images<br>
					<span v-text="`Maximum ${this.limit}`"/>
				</span>
			</template>
		</label>
		<p class="help is-danger" v-if="error" v-text="error"/>
	</div>
</template>

<script>
	import UploadFile from "@/Classes/UploadFile";

	export default {
		name: "MultiFileField",

		props: {
			value: {
				type: Object,
				default() {
					return {};
				}
			},
			error: {
				type: String,
				default: ''
			},
			preview: {
				type: String,
				default: ''
			},
			name: {
				type: String,
				default: 'media[images]'
			},
			limit: {
				type: Number,
				default: 5
			}

		},

		methods: {
			async imageAdded(event) {
				const filesObject = this.value;
				const files = event.target.files;
				for (let i = 0; i < files.length && Object.values(filesObject).length < this.limit; i++) {
					const file = files[i];
					if (file.type.split('/')[0] === 'image') {
						filesObject[`${file.name}-${Date.now()}`] = await UploadFile.makeFromFile(file);
					}
				}
				this.$emit('input', {...filesObject});
			},

			removeImage(key) {
				const filesObject = this.value;
				delete filesObject[key];
				this.$emit('input', {...filesObject});
			}
		},
	}
</script>

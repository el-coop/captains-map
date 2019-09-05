<template>
	<div class="field">
		<label class="dropzone" :class="{'is-flex-column': ! Object.keys(value).length}">
			<input class="dropzone__input" type="file" :name="name" @change="imageAdded" multiple accept="image/*">
			<template v-if="Object.keys(value).length">
				<div v-for="(file,key) in value" :key="key" class="dropzone__preview" @click.prevent="removeImage(key)">
					<img class="dropzone__preview-image" :src="file.preview">
					<div class="dropzone__preview-label">
						<FontAwesomeIcon icon="times-circle" class="dropzone__preview-label-icon"/>
						<span v-text="file.name"/>
					</div>
				</div>
			</template>
			<template v-else>
				<span class="dropzone__icon">
					<FontAwesomeIcon icon="upload"/>
				</span>
				<span>
					Choose an image
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
			name: {
				type: String,
				default: 'media[images]'
			},

		},

		methods: {
			async imageAdded(event) {
				const filesObject = this.value;
				const files = event.target.files;
				for (let i = 0; i < files.length; i++) {
					const file = files[i];
					if(file.type.split('/')[0] === 'image'){
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

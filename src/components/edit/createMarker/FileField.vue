<template>
	<div class="field">
		<div class="file is-boxed has-name is-light">
			<label class="file-label">
				<input class="file-input" type="file" name="media[image]" @change="imageSelected">
				<span class="file-cta">
                                <span class="file-icon">
                                    <font-awesome-icon icon="upload"/>
                                </span>
                                <span class="file-label">
                                    Choose an image
                                </span>
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
			}
		},

		methods: {
			imageSelected(event) {
				let file = event.target.files;
				if (file[0]) {
					return this.file = file[0];
				}

				this.file = null;
			},
		},

		computed: {
			file: {
				get(){
					return this.value;
				},
				set(value){
					this.$emit('input', value);
				}
			}
		}
	}
</script>

<style scoped>

</style>
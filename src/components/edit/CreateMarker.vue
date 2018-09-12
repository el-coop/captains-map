<template>
	<ajax-form :headers="formHeaders" @submitting="loading = true" @submitted="submitted" @errors="getErrors"
			   :extra-data="{
            lat: latLng.lat,
            lng: latLng.lng,
            time: form.dateTime,
            'media.camera': form.media.type === 'camera' ? form.media.camera : '' ,
            'media.file': null
        }" action="marker/create">
		<slide-up-modal name="create-marker" @closed="resetForm">
			<p slot="header" class="card-header-title">Create new marker</p>
			<template slot="content">
				<create-marker-type-toggle v-model="form.media.type"/>
				<create-marker-file-field v-if="form.media.type === 'image'" v-model="form.media.file"
										  :error="errors ? errors['media.file'] : ''"/>
				<create-marker-instagram-field v-if="form.media.type === 'instagram'" v-model="form.media.path"
											   :error="errors ? errors['media.path'] : ''"/>
				<create-marker-cam-view v-if="form.media.type === 'camera'" v-model="form.media.camera"
										:error="errors ? errors['media.camera'] : ''"/>
				<create-marker-date-time-field v-model="form.dateTime" :error="errors? errors['time'] : ''"/>
				<create-marker-type-field v-model="form.type" :error="errors? errors['type'] : ''"/>
				<div class="field">
					<label for="description" class="label">Description</label>
					<div class="control">
                        <textarea id="description" class="textarea" v-model="form.description"
								  name="description"></textarea>
					</div>
				</div>
			</template>
			<template slot="footer">
				<p class="card-footer-item">
                    <span>
                        <a href="#" @click="$modal.hide('create-marker')">Close</a>
                    </span>
				</p>
				<p class="card-footer-item">
					<button class="button is-primary is-fullwidth" :class="{'is-loading' : loading}">Submit</button>
				</p>
			</template>
		</slide-up-modal>
	</ajax-form>
</template>

<script>
	import AjaxForm from "@/components/utilities/ajaxForm";
	import SlideUpModal from "../global/slide-up-modal";
	import CreateMarkerTypeToggle from "./createMarker/TypeToggle";
	import CreateMarkerFileField from "./createMarker/FileField";
	import CreateMarkerInstagramField from "./createMarker/InstagramField";
	import CreateMarkerTypeField from "./createMarker/TypeField";
	import CreateMarkerDateTimeField from "./createMarker/DateTimeField";
	import CreateMarkerCamView from "./createMarker/CameraField";

	export default {
		name: "new-marker-modal",

		components: {
			CreateMarkerCamView,
			CreateMarkerDateTimeField,
			CreateMarkerTypeField,
			CreateMarkerInstagramField,
			CreateMarkerFileField,
			CreateMarkerTypeToggle,
			SlideUpModal,
			AjaxForm,
		},

		props: {
			latLng: {
				type: Object,
				required: true
			}
		},

		data() {
			return {
				form: {
					media: {
						type: 'camera',
						file: null,
						path: '',
						camera: ''
					},
					description: '',
					dateTime: new Date(),
					type: 'Visited'
				},
				loading: false,
				formHeaders: {
					'Content-Type': 'multipart/form-data'
				},
				errors: null,
			}
		},

		methods: {

			getErrors(errors) {
				this.errors = errors;
			},

			submitted(response) {
				this.loading = false;
				if (response.status !== 200) {
					return;
				}
				this.$store.commit('Markers/add', response.data);

				this.$modal.hide('create-marker');
			},

			resetForm() {
				this.errors = null;
				this.form = {
					media: {
						type: 'camera',
						file: null,
						path: '',
						camera: ''
					},
					description: '',
					dateTime: new Date(),
					type: 'Visited'
				};
			}
		},

	}
</script>

<style scoped lang="scss">
	.field > .field {
		margin-bottom: 0;
	}
</style>

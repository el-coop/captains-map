<template>
	<form :headers="formHeaders" @submitting="loading = true" @submit.prevent="queueUpload"
		  action="marker/create">
		<slide-up-modal name="create-marker" @before-open="prefill" route-name="edit">
			<p slot="header" class="card-header-title">Create new marker</p>
			<template slot="content">
				<create-marker-type-toggle v-model="form.media.type"/>
				<create-marker-file-field v-if="form.media.type === 'image'" v-model="form.media.file"
										  :error="errors ? errors['media.file'] : ''"
										  :init-preview="form.media.preview"/>
				<create-marker-instagram-field v-if="form.media.type === 'instagram'" v-model="form.media.path"
											   :error="errors ? errors['media.path'] : ''"/>
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
					<button class="button is-danger is-fullwidth" @click="cancelUpload" v-if="this.marker"
							type="button">
						Cancel upload
					</button>
					<span v-else>
                        <a href="#" @click="$modal.hide('create-marker')">Close</a>
                    </span>
				</p>
				<p class="card-footer-item">
					<button class="button is-primary is-fullwidth" :class="{'is-loading' : loading}">Submit</button>
				</p>
			</template>
		</slide-up-modal>
	</form>
</template>

<script>
	import FormDataMixin from "@/Components/Utilities/FormDataMixin";
	import SlideUpModal from "@/Components/Utilities/SlideUpModal";
	import CreateMarkerTypeToggle from "@/Components/Modals/CreateMarker/TypeToggle";
	import CreateMarkerFileField from "@/Components/Modals/CreateMarker/FileField";
	import CreateMarkerInstagramField from "@/Components/Modals/CreateMarker/InstagramField";
	import CreateMarkerTypeField from "@/Components/Modals/CreateMarker/TypeField";
	import CreateMarkerDateTimeField from "@/Components/Modals/CreateMarker/DateTimeField";

	export default {
		name: "new-marker-modal",
		mixins: [
			FormDataMixin
		],

		components: {
			CreateMarkerDateTimeField,
			CreateMarkerTypeField,
			CreateMarkerInstagramField,
			CreateMarkerFileField,
			CreateMarkerTypeToggle,
			SlideUpModal,
		},

		props: {
			latLng: {
				type: Object,
				required: true
			},
			marker: {
				type: Object,
			}
		},

		data() {
			return {
				form: {
					media: {
						type: 'image',
						file: null,
						path: '',
						preview: ''
					},
					description: '',
					dateTime: new Date(),
					type: 'Visited'
				},
				extraData: {
					lat: this.latLng.lat,
					lng: this.latLng.lng,
					time: new Date(),
				},
				loading: false,
				formHeaders: {
					'Content-Type': 'multipart/form-data'
				},
				errors: null,
			}
		},


		methods: {
			async queueUpload() {
				this.loading = true;
				const data = this.getData();
				if (this.marker) {
					data.uploadTime = this.marker.uploadTime;
					await this.$store.dispatch('Uploads/returnToQueue', data);
				} else {
					await this.$store.dispatch('Uploads/upload', data);
				}
				this.loading = false;
				this.$modal.hide('create-marker');
			},

			async cancelUpload() {
				await this.$store.dispatch('Uploads/cancelUpload', this.marker.uploadTime);
				this.$modal.hide('create-marker');
			},

			prefill() {
				if (!this.marker) {
					this.resetForm();
					return;
				}
				this.form.description = this.marker.description;
				this.form.type = this.marker.type;
				this.form.dateTime = this.marker.time;
				this.form.media.type = this.marker['media[type]'];
				this.form.media.path = this.marker['media[path]'];
				if (this.marker['media[type]'] === 'image') {
					this.form.media.preview = 'data:image/jpeg;base64,' + btoa(this.marker['media[image]']);
				}
				if (this.marker.error.status === 422) {
					this.errors = {};
					this.marker.error.data.errors.forEach((error) => {
						this.errors[error.param] = error.msg;
					});
				}
			},

			resetForm() {
				this.errors = null;
				this.form = {
					media: {
						type: 'image',
						file: null,
						path: ''
					},
					description: '',
					dateTime: new Date(),
					type: 'Visited'
				};
			},
		},

		watch: {
			latLng(value) {
				this.extraData.lat = value.lat;
				this.extraData.lng = value.lng;
			},

			marker() {
				this.prefill();
			},

			'form.dateTime'(value) {
				this.extraData.time = value;
			}
		}

	}
</script>

<style scoped lang="scss">
	.field > .field {
		margin-bottom: 0;
	}
</style>

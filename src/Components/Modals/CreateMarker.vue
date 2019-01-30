<template>
	<form :headers="formHeaders" @submitting="loading = true" @submit.prevent="queueUpload"
		  @submitted="submitted"
		  @errors="getErrors"
		  action="marker/create">
		<slide-up-modal name="create-marker" @closed="resetForm" route-name="edit">
			<p slot="header" class="card-header-title">Create new marker</p>
			<template slot="content">
				<create-marker-type-toggle v-model="form.media.type"/>
				<create-marker-file-field v-if="form.media.type === 'image'" v-model="form.media.file"
										  :error="errors ? errors['media.file'] : ''"/>
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
                    <span>
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
			}
		},

		data() {
			return {
				form: {
					media: {
						type: 'image',
						file: null,
						path: ''
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
				await this.$store.dispatch('Uploads/upload', data);
				this.loading = false;
				this.$modal.hide('create-marker');
			},

			getErrors(errors) {
				this.errors = errors;
			},

			submitted(response) {
				this.loading = false;
				if (response.status !== 200) {
					if (!response.data.errors) {
						this.$toast.error('Please try again at a later time', 'Creation failed.');
					}
					return;
				}
				this.$store.commit('Markers/addAtStart', response.data);

				this.$modal.hide('create-marker');
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
			}
		},

		watch: {
			latLng(value) {
				this.extraData.lat = value.lat;
				this.extraData.lng = value.lng;
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

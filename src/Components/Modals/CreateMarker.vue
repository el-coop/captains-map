<template>
	<form @submitting="loading = true" @submit.prevent="queueUpload">
		<BaseModal route-name="edit" v-model="modal">
			<template #header>
				<p class="card-header-title">Create new marker</p>
			</template>

			<template #content>
				<TypeToggle v-model="form.media.type"/>
				<FileField v-if="form.media.type === 'image'"
						   v-model="form.media.file"
						   :error="errors ? errors['media.file'] : ''"
						   :init-preview="form.media.preview"/>
				<TextField v-if="form.media.type === 'instagram'"
						   label="Instagram Link"
						   name="media[path]"
						   v-model="form.media.path"
						   :error="(errors && errors['media.path']) ? 'You most give a valid instagram link.' : ''"/>
				<DateTimeField label="Time"
							   v-model="form.dateTime"
							   :error="(errors && errors['time']) ?  'Invalid date or time.' : ''"/>
				<SelectField v-model="form.type" :error="errors ? errors['type'] : ''" :options="markerTypes"
							 label="Type"
							 name="type"/>
				<SearchLocationField v-model="form.location" :latLng="latLng"/>
				<TextareaField label="Description" v-model="form.description" name="description"/>
			</template>

			<template #footer>
				<p class="card-footer-item">
					<button v-if="marker" class="button is-danger is-fullwidth" @click="cancelUpload"
							type="button">
						Cancel upload
					</button>
					<span v-else>
                        <a @click="modal=false">Close</a>
                    </span>
				</p>
				<p class="card-footer-item">
					<button class="button is-primary is-fullwidth" :class="{'is-loading' : loading}">Submit</button>
				</p>
			</template>
		</BaseModal>
	</form>
</template>

<script>
	import FormDataMixin from "@/Components/Utilities/FormDataMixin";
	import BaseModal from "@/Components/Utilities/BaseModal";
	import TypeToggle from "@/Components/Modals/CreateMarker/TypeToggle";
	import FileField from "@/Components/Modals/CreateMarker/FileField";
	import TextField from "@/Components/Modals/CreateMarker/TextField";
	import SelectField from "@/Components/Modals/CreateMarker/SelectField";
	import DateTimeField from "@/Components/Modals/CreateMarker/DateTimeField";
	import SearchLocationField from "@/Components/Modals/CreateMarker/SearchLocationField";
	import TextareaField from "@/Components/Modals/CreateMarker/TextareaField";

	export default {
		name: "CreateMarker",
		mixins: [
			FormDataMixin
		],

		components: {
			TextareaField,
			SearchLocationField,
			DateTimeField,
			SelectField,
			TextField,
			FileField,
			TypeToggle,
			BaseModal,
		},

		created() {
			this.$bus.$on('map-create-marker', this.createMarker);
			this.$bus.$on('user-marker-click', this.createMarker);
		},
		beforeDestroy() {
			this.$bus.$off('map-create-marker', this.createMarker);
			this.$bus.$off('user-marker-click', this.createMarker);
		},

		data() {
			return {
				latLng: {},
				form: {
					media: {
						type: 'image',
						file: null,
						path: '',
						preview: ''
					},
					location: '',
					description: '',
					dateTime: new Date(),
					type: 'Visited'
				},
				loading: false,
				markerTypes: {
					Visited: 'Visited',
					Plan: 'Plan',
					Suggestion: 'Suggestion',
					Other: 'Other'
				},
				modal: false,
				errors: null,
				marker: null,
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
				this.modal = false;
			},

			async cancelUpload() {
				await this.$store.dispatch('Uploads/cancelUpload', this.marker.uploadTime);
				this.modal = false;
			},

			prefill() {
				if (!this.marker) {
					this.resetForm();
					return;
				}

				const markerTime = new Date(this.marker.time);

				this.form.description = this.marker.description;
				this.form.location = this.marker.location;
				this.form.type = this.marker.type;
				this.form.dateTime = markerTime.setMinutes(markerTime.getMinutes() + markerTime.getTimezoneOffset());
				this.form.media.type = this.marker['media[type]'];
				this.form.media.path = this.marker['media[path]'];
				this.form.media.file = null;
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
					location: '',
					description: '',
					dateTime: new Date(),
					type: 'Visited'
				};
			},

			createMarker(data) {
				if (data.lat && data.lng) {
					this.latLng = data;
				} else {
					this.latLng = data.event.latlng;
				}
				this.marker = data.marker || null;
				this.prefill();
				this.modal = true;
			},
		},

		computed: {
			extraData() {
				return {
					lat: this.latLng.lat,
					lng: this.latLng.lng,
					time: this.form.dateTime,
				};
			}
		},
	}
</script>

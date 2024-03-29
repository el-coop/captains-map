<template>
	<form @submitting="loading = true" @submit.prevent="queueUpload">
		<BaseModal v-model:active="modal">
			<template #header>
				<p class="card__header-title">Create new marker</p>
			</template>

			<template #content>
				<TypeToggle v-model="form.media.type"/>
				<MultiFileField v-if="form.media.type === 'image'"
								v-model="form.media.files"
								:error="errors ? errors['media.files'] : ''"/>
				<TextField v-if="form.media.type === 'instagram'"
						   label="Instagram Link"
						   name="media[path]"
						   v-model="form.media.path"
						   :error="(errors && errors['media.path']) ? 'You most give a valid instagram link.' : ''"/>
				<DateTimeField label="Time"
							   v-model="form.time"
							   :error="(errors && errors['time']) ?  'Invalid date or time.' : ''"/>
				<SelectField v-model="form.type" :error="errors ? errors['type'] : ''" :options="markerTypes"
							 label="Type"
							 name="type"/>
				<SearchLocationField v-model="form.location" :latLng="{lat: form.lat, lng: form.lng}"
                                     :error="(errors && errors['location']) ? 'The maximum length for location is 255 characters' : ''"/>
				<TextareaField label="Description" v-model="form.description" name="description"/>
			</template>

			<template #footer>
				<p class="card__footer-item">
					<button v-if="marker" class="button is-danger-background is-fullwidth" @click="cancelUpload"
							type="button">
						Cancel upload
					</button>
					<span v-else>
                        <a @click="closeModal()">Close</a>
                    </span>
				</p>
				<p class="card__footer-item">
					<button class="button is-primary-background is-fullwidth" :class="{'is-loading' : loading}">Submit
					</button>
				</p>
			</template>
		</BaseModal>
	</form>
</template>

<script>
	import FormDataMixin from "@/Components/Utilities/FormDataMixin.vue";
	import BaseModal from "@/Components/Utilities/BaseModal.vue";
	import TypeToggle from "@/Components/Modals/CreateMarker/TypeToggle.vue";
	import TextField from "@/Components/Modals/CreateMarker/TextField.vue";
	import SelectField from "@/Components/Modals/CreateMarker/SelectField.vue";
	import DateTimeField from "@/Components/Modals/CreateMarker/DateTimeField.vue";
	import SearchLocationField from "@/Components/Modals/CreateMarker/SearchLocationField.vue";
	import TextareaField from "@/Components/Modals/CreateMarker/TextareaField.vue";
	import MultiFileField from "@/Components/Modals/CreateMarker/MultiFileField.vue";

	export default {
		name: "CreateMarker",
		mixins: [
			FormDataMixin
		],
        emits: ['close'],
        
        props:{
		    editData: null,
        },

		components: {
			MultiFileField,
			TextareaField,
			SearchLocationField,
			DateTimeField,
			SelectField,
			TextField,
			TypeToggle,
			BaseModal,
		},
  

		data() {
			return {
				form: {
					story: this.$store.state.Stories.story ? this.$store.state.Stories.story.id : null,
					media: {
						type: 'image',
						files: {},
						path: '',
					},
					lat: 0,
					lng: 0,
					location: '',
					description: '',
					time: new Date(),
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
		    closeModal(){
                this.modal = false;
                this.$emit('close');
            },
			async queueUpload() {
				this.loading = true;
				if (this.marker) {
					await this.$store.dispatch('Uploads/returnToQueue', {
						...this.form,
						uploadTime: this.marker.uploadTime
					});
				} else {
					await this.$store.dispatch('Uploads/upload', this.form);
				}
				this.loading = false;
				this.closeModal();
			},

			async cancelUpload() {
				await this.$store.dispatch('Uploads/cancelUpload', this.marker.uploadTime);
                this.closeModal();
			},

			prefill() {
				if (!this.marker) {
					this.resetForm();
					return;
				}
				const markerTime = new Date(this.marker.time);

				this.form.story = this.marker.story || null;
				this.form.description = this.marker.description;
				this.form.location = this.marker.location;
				this.form.type = this.marker.type;
				this.form.time = markerTime.setMinutes(markerTime.getMinutes() + markerTime.getTimezoneOffset());
				this.form.media.type = this.marker.media.type;
				this.form.media.path = this.marker.media.path;
				this.form.media.files = this.marker.media.files;
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
					story: this.$store.state.Stories.story ? this.$store.state.Stories.story.id : null,
					media: {
						type: 'image',
						files: {},
						path: ''
					},
					lat: this.form.lat,
					lng: this.form.lng,
					location: '',
					description: '',
					time: new Date(),
					type: 'Visited'
				};
			},

			createMarker(data) {
				if (data.lat && data.lng) {
					this.form.lat = data.lat;
					this.form.lng = data.lng;
				} else {
					this.form.lat = data.event.latlng.lat;
					this.form.lng = data.event.latlng.lng;
				}
				this.marker = data.event.marker || null;
				this.prefill();
				this.modal = true;
			},
		},
        
        watch: {
		    editData(value){
		        if(value){
		            this.createMarker(value);
                }
            }
        }
	}
</script>

<template>
    <div class="dashboard__control card-content">
        <ajax-form :headers="formHeaders" @submitting="loading = true" @submitted="submitted" @errors="getErrors"
                   :extra-data="{
            lat: latLng.lat,
            lng: latLng.lng,
            time: dateTime
        }" action="marker/edit/create">
            <div class="field">
                <div class="file is-boxed has-name is-light">
                    <label class="file-label">
                        <input class="file-input" type="file" name="media" @change="imageSelected">
                        <span class="file-cta">
                        <span class="file-icon">
                            <font-awesome-icon :icon="uploadIcon"/>
                        </span>
                        <span class="file-label">
                            Choose an image
                        </span>
                    </span>
                        <span class="file-name" v-html="file ? file.name : 'Choose an image'">
                    </span>
                    </label>
                </div>
            </div>
            <div class="field">
                <label class="label">Time</label>

                <div class="field is-grouped">
                    <div class="control is-expanded">
                        <datapicker v-model="date" icon-pack="fa"/>
                    </div>
                    <div class="control is-expanded">
                        <timepicker v-model="time"/>
                    </div>
                </div>
                <p class="help is-danger" v-if="errors && errors.time" v-html="errors.time"></p>
            </div>
            <div class="field">
                <label for="description" class="label">Description</label>
                <div class="control">
                    <textarea id="description" class="textarea" v-model="description" name="description"></textarea>
                </div>
            </div>
            <div class="field has-text-right">
                <button class="button is-primary" :class="{'is-loading' : loading}">Submit</button>
            </div>
        </ajax-form>
    </div>
</template>

<script>
	import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
	import UploadIcon from '@fortawesome/fontawesome-free-solid/faUpload';
	import Datapicker from 'buefy/src/components/datepicker';
	import Timepicker from 'buefy/src/components/timepicker';
	import AjaxForm from "@/components/utilities/ajaxForm";
	import Moment from 'moment';

	export default {
		name: "new-marker-modal",

		components: {
			AjaxForm,
			FontAwesomeIcon,
			Datapicker,
			Timepicker
		},

		props: {
			latLng: {
				type: Object,
				required: true
			}
		},

		data() {
			return {
				file: null,
				description: '',
				date: new Date(),
				time: new Date(),
				loading: false,
				formHeaders: {
					'Content-Type': 'multipart/form-data'
				},
				errors: null
			}
		},

		methods: {
			imageSelected(event) {
				let file = event.target.files;
				if (!file[0]) {
					return this.fileName = 'Choose an image';
				}

				this.file = file[0];
			},

			getErrors(errors) {
				this.errors = errors;
			},


			submitted(response) {
				this.loading = false;
				if (response.status !== 200) {
					return;
				}
				this.$store.commit('addMarker', response.data);

				this.$emit('close-modal');

			}
		},

		computed: {
			uploadIcon() {
				return UploadIcon;
			},
			dateTime() {
				return `${Moment(this.date).format('MM/DD/YYYY')} ${Moment(this.time).format('hh:mm')}`;
			}
		}
	}
</script>

<template>
    <ajax-form :headers="formHeaders" @submitting="loading = true" @submitted="submitted" @errors="getErrors"
               :extra-data="{
            lat: latLng.lat,
            lng: latLng.lng,
            time: dateTime
        }" action="marker/create">
        <slide-up-modal name="create-marker">
            <p slot="header" class="card-header-title">Create new marker</p>
            <template slot="content">
                <div class="field">
                    <div class="file is-boxed has-name is-light">
                        <label class="file-label">
                            <input class="file-input" type="file" name="media" @change="imageSelected">
                            <span class="file-cta">
                        <span class="file-icon">
                            <font-awesome-icon icon="upload"/>
                        </span>
                        <span class="file-label">
                            Choose an image
                        </span>
                    </span>
                            <span class="file-name" v-html="form.file ? form.file.name : 'Choose an image'">
                    </span>
                        </label>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Time</label>

                    <div class="field is-grouped">
                        <div class="control is-expanded">
                            <datapicker v-model="form.date" icon-pack="fa"/>
                        </div>
                        <div class="control is-expanded">
                            <timepicker v-model="form.time"/>
                        </div>
                    </div>
                    <p class="help is-danger" v-if="errors && errors.time" v-html="errors.time"></p>
                </div>
                <div class="field">
                    <label for="description" class="label">Type</label>
                    <div class="select">
                        <select name="type">
                            <option v-for="(markerType, index) in markerTypes" :value="markerType"
                                    v-text="markerType"></option>
                        </select>
                    </div>
                </div>
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
	import Datapicker from 'buefy/src/components/datepicker';
	import Timepicker from 'buefy/src/components/timepicker';
	import AjaxForm from "@/components/utilities/ajaxForm";
	import Moment from 'moment';
	import SlideUpModal from "../global/slide-up-modal";

	export default {
		name: "new-marker-modal",

		components: {
			SlideUpModal,
			AjaxForm,
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
				form: {
					file: null,
					description: '',
					date: new Date(),
					time: new Date(),
				},
				loading: false,
				formHeaders: {
					'Content-Type': 'multipart/form-data'
				},
				errors: null,
				markerTypes: [
					'Visited',
					'Plan',
					'Suggestion',
					'Other'
				]
			}
		},

		methods: {
			imageSelected(event) {
				let file = event.target.files;
				if (file[0]) {
					return this.form.file = file[0];
				}

				this.form.file = null;
			},

			getErrors(errors) {
				this.errors = errors;
			},


			submitted(response) {
				this.loading = false;
				if (response.status !== 200) {
					return;
				}
				this.form = {
					file: null,
					description: '',
					date: new Date(),
					time: new Date(),
				};
				this.$store.commit('Markers/add', response.data);

				this.$modal.hide('create-marker');
			}
		},

		computed: {
			dateTime() {
				return `${Moment(this.date).format('MM/DD/YYYY')} ${Moment(this.time).format('hh:mm')}`;
			}
		}
	}
</script>

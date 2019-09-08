<template>
	<div class="field">
		<label class="label" for="location">Location</label>
		<div class="field has-addons dropdown is-hoverable">
			<div class="control is-expanded">
				<input type="text" id="location" class="input" v-model="content"
					   name="location">
			</div>
			<div class="dropdown-menu">
				<div class="dropdown-content" v-if="searched">
					<a v-for="(result, index) in results" :key="index"
					   class="dropdown-item"
					   v-text="result"
					   @click="content = result">
					</a>
					<p class="help is-danger dropdown-item" v-if="! results.length">
						Could not find location
					</p>
				</div>
			</div>
			<div class="control">
				<button class="button is-info" type="button" @click="search" :disabled="searched"
						:class="{'is-loading': searching}">
					<span class="icon">
						<FontAwesomeIcon icon="search-location"/>
					</span>
				</button>
			</div>

		</div>
		<p class="help is-danger" v-if="error">The location is invalid.</p>
	</div>

</template>

<script>
	import { LeafletMapService } from "@/Services/LeafletMapService";

	export default {
		name: "SearchLocationField",

		props: {
			value: {
				type: String,
				default: ''
			},
			error: {
				type: String,
				default: '',
			},
			latLng: {
				type: Object,
				required: true
			},
		},

		data() {
			return {
				searched: false,
				searching: false,
				results: []
			}
		},

		computed:{
			content:{
				get(){
					return this.value;
				},
				set(value){
					this.$emit('input', value);
				}
			}
		},

		methods: {
			async search() {
				this.searching = true;
				const response = await LeafletMapService.reverseGeocode(this.latLng);
				response.forEach((address) => {
					let formattedAddress = '';
					if (address.streetName) {
						formattedAddress += address.streetName;
					}
					if (address.streetNumber) {
						formattedAddress += `, ${address.streetNumber}`
					}
					if (address.city) {
						if (formattedAddress !== '') {
							formattedAddress += ' - ';
						}
						formattedAddress += address.city;
					}
					if (address.country) {
						if (formattedAddress !== '') {
							formattedAddress += ', ';
						}
						formattedAddress += address.country;
					}
					this.results.push(formattedAddress);

					if (address.formattedAddress) {
						this.results.push(address.formattedAddress);
					}
				});
				this.searched = true;
				this.searching = false;

			},
		}
	}
</script>

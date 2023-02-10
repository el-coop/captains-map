<template>
	<div class="field">
		<label class="label" for="location">Location</label>
		<div class="field addon-row dropdown">
			<input type="text" id="location" class="input addon-row__control--left" v-model="content"
				   name="location">
			<div class="dropdown__menu">
				<div class="dropdown__content" v-if="searched">
					<a v-for="(result, index) in results" :key="index"
					   class=" dropdown__content-item"
					   v-text="result"
					   @click="content = result">
					</a>
					<p class="help is-danger dropdown__content-item" v-if="! results.length">
						Could not find location
					</p>
				</div>
			</div>
			<button class="button is-selected-background addon-row__control--right" type="button" @click="search"
					:disabled="searched"
					:class="{'is-loading': searching}">
				<span>
					<FontAwesomeIcon icon="search-location"/>
				</span>
			</button>

		</div>
		<p class="help is-danger" v-if="error" v-text="error"/>
	</div>

</template>

<script>
	import { LeafletMapService } from "@/Services/LeafletMapService";

	export default {
		name: "SearchLocationField",
        emits: ['update:modelValue'],

		props: {
            modelValue: {
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

		computed: {
			content: {
				get() {
					return this.modelValue;
				},
				set(value) {
					this.$emit('update:modelValue', value);
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

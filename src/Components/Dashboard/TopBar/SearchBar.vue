<template>
	<div class="field has-addons is-full-touch">
		<div class="control">
			<div class="dropdown is-hoverable is-rounded">
				<div class="dropdown-trigger">
					<button class="button is-rounded">
						<font-awesome-icon :icon="searchOptions[searchCategory].icon"/>
					</button>
				</div>
				<div class="dropdown-menu">
					<div class="dropdown-content">
						<a class="dropdown-item" v-for="(settings, option) in searchOptions"
						   @click="searchCategory = option"
						   v-if="option !== searchCategory">
							<font-awesome-icon :icon="settings.icon"/>&nbsp;&nbsp;{{ option }}
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="control dropdown is-hoverable search-field">
			<input type="search" class="input dropdown-trigger" v-model="query" @keyup="searched = false"/>
			<div class="dropdown-menu">
				<div class="dropdown-content" v-if="results.length || searched">
					<a v-for="(result, index) in results" :key="index" v-text="searchCategory === 'Users' ? result :
					result.formattedAddress"
					   class="dropdown-item"
					   @click="resultClicked(result)">
					</a>
					<p class="help is-danger dropdown-item" v-if="! results.length && searched">
						No results found for <span v-text="query"/>
					</p>
				</div>
			</div>
		</div>
		<div class="control">
			<button class="button is-rounded" :class="{'is-loading': searching}" @click="search">
				<font-awesome-icon icon="search"/>
			</button>
		</div>
	</div>
</template>

<script>
	import Map, { LeafletMapService } from '@/Services/LeafletMapService';

	export default {
		name: "search-bar",
		data() {
			return {
				query: '',
				searching: false,
				results: [],
				searched: false,
				searchOptions: {
					Users: {
						icon: 'users',
						funcName: 'searchUsers'
					},
					Address: {
						icon: 'address-card',
						funcName: 'searchLocation'
					},
				},
				searchCategory: 'Users'
			}
		},

		methods: {
			async search() {
				this.results = [];
				if (this.query === '') {
					return;
				}

				this.searching = true;

				this.results = await this[this.searchOptions[this.searchCategory].funcName]();

				this.searching = false;
				this.searched = true;

			},

			async searchLocation() {
				return await LeafletMapService.locate(this.query);
			},

			async searchUsers() {
				try {
					const response = await this.$http.get(`search/users/${this.query}`);
					if (response.status === 200 || response.status === 'cached') {
						return response.data;
					}
				} catch (error) {
				}
				return [];

			},

			resultClicked(result) {
				if (this.searchCategory === 'Address') {
					Map.move([result.latitude, result.longitude], 17);
				} else {
					this.$router.push(result);
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.dropdown-item {
		white-space: normal;
	}

	.field.has-addons {
		margin: 0 0 5px 0;
		padding: 0.2em 0.25em;
		background-color: whitesmoke;

		@media #{$above-tablet}{
			background-color: transparent;
			margin: 0;
		}
	}

	.dropdown-menu {
		width: 100%;
	}

	.search-field {
		flex: 1;
	}
</style>
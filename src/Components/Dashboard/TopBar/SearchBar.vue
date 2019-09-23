<template>
	<div class="field has-addons is-full-touch search-bar">
		<div class="control">
			<div class="dropdown is-hoverable is-rounded">
				<div class="dropdown-trigger">
					<button class="button">
						<FontAwesomeIcon :icon="searchOptions[searchCategory].icon" fixed-width/>
					</button>
				</div>
				<div class="dropdown-menu search-bar__dropdown-menu">
					<div class="dropdown-content">
						<a class="dropdown-item search-bar__dropdown-item" v-for="category in availableSearchCategories"
						   @click="changeSearch(category)">
							<FontAwesomeIcon :icon="searchOptions[category].icon"/>
							&nbsp&nbsp;{{ category }}
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="control dropdown is-hoverable search-bar__field" :class="{'is-active': openResults}">
			<input type="search" class="input dropdown-trigger" v-model="query" @keyup="searched = false"
				   @keyup.enter="search(searchOptions[searchCategory].funcName)"/>
			<div class="dropdown-menu search-bar__dropdown-menu">
				<div class="dropdown-content" v-if="results.length || searched">
					<a v-for="(result, index) in results" :key="index" v-text="formatResult(result)"
					   class="dropdown-item search-bar__dropdown-item"
					   @click="resultClicked(result)">
					</a>
					<p class="help is-danger dropdown-item search-bar__dropdown-item"
					   v-if="! results.length && searched">
						No results found for <span v-text="query"/>
					</p>
				</div>
			</div>
		</div>

		<div class="control">
			<button class="button" :class="{'is-loading': searching}"
					@click="search(searchOptions[searchCategory].funcName)" @mouseenter="openResults = true"
					@mouseleave="openResults = false">
				<FontAwesomeIcon icon="search"/>
			</button>
		</div>
	</div>
</template>

<script>
	import Map, { LeafletMapService } from '@/Services/LeafletMapService';

	export default {
		name: "SearchBar",
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
				searchCategory: 'Users',
				openResults: false
			}
		},

		computed: {
			availableSearchCategories() {
				return Object.keys(this.searchOptions).filter((key) => {
					return key !== this.searchCategory;
				});
			}
		},

		methods: {
			async search(funcName) {
				this.results = [];
				if (this.query === '') {
					return;
				}

				this.searching = true;

				this.results = await this[funcName]();

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

			changeSearch(category) {
				this.results = [];
				this.searched = false;
				this.searchCategory = category;
			},

			formatResult(result) {
				if (this.searchCategory === 'Users') {
					return result;
				}

				return result.formattedAddress;
			}
		},
	}
</script>

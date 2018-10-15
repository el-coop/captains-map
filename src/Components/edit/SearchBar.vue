<template>
	<div class="dashboard__control dashboard__control--dark">
		<div></div>
		<div class="field has-addons dropdown is-hoverable">
			<div class="control">
				<input type="text" class="input is-rounded" v-model="query"/>
			</div>
			<div class="dropdown-menu">
				<div class="dropdown-content" v-if="results.length || searched">
					<a v-for="(result, index) in results" :key="index" v-text="result.formattedAddress"
					   class="dropdown-item"
					   @click="moveMap([result.latitude,result.longitude])">
					</a>
					<p class="help is-danger dropdown-item" v-if="! results.length && searched">
						No results found for <span v-text="query"/>
					</p>
				</div>
			</div>
			<div class="control">
				<button class="button is-rounded" :class="{'is-loading': searching}" @click="search">Search</button>
			</div>
		</div>
		<div class="field has-addons has-text-centered side-buttons">
			<div class="control is-expanded">
				<button class="button is-dark is-fullwidth" @click="$router.push('/')">Map Feed</button>
			</div>
			<logout/>
		</div>
	</div>
</template>

<script>
	import Map, { LeafletMapService } from '@/Services/LeafletMapService';
	import Logout from "../Global/topBar/Logout";

	export default {
		name: "search-bar",
		components: {Logout},
		data() {
			return {
				query: '',
				searching: false,
				results: [],
				searched: false
			}
		},

		methods: {
			async search() {
				this.results = [];
				if (this.query === '') {
					return;
				}

				this.searching = true;

				this.results = await LeafletMapService.locate(this.query);
				this.searched = true;

				this.searching = false;
			},

			moveMap(latLng) {
				Map.move(latLng, 17);
			}
		},

		watch: {
			query() {
				this.searched = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.dashboard__control {
		padding: 0 2px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		@media #{$above-tablet} {
			justify-content: space-between;
			flex-direction: row;
		}
	}

	.field.has-addons.side-buttons {
		margin-top: 6px;
		@media #{$above-tablet} {
			width: 20vw;
			padding-right: 20px;
			margin-top: 0;
		}
	}

	.dropdown-item {
		white-space: normal;
	}

	.field.has-addons {
		margin: 0;
	}

	.dropdown-menu {
		width: 100%;
	}
</style>
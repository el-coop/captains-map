<template>
	<div class="field has-addons dropdown is-hoverable is-hidden-touch">
		<div class="control">
			<input type="text" class="input is-rounded" v-model="query" @keyup="searched = false"/>
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
</template>

<script>
	import Map, { LeafletMapService } from '@/Services/LeafletMapService';
	import Logout from "../Utilities/Logout";

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
	}
</script>

<style lang="scss" scoped>

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
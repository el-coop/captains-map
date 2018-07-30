<template>
    <div class="dashboard__control dashboard__control--dark">
        <div class="field  has-addons dropdown is-hoverable" style="margin: auto">
            <div class="control">
                <input type="text" class="input is-rounded" v-model="query"/>
            </div>
            <div v-if="results.length" class="dropdown-menu">
                <div class="dropdown-content">
                    <a v-for="(result, index) in results" :key="index" v-text="result.name" class="dropdown-item"
                       @click="moveMap(result.center)">
                    </a>
                </div>
            </div>
            <div class="control">
                <button class="button is-rounded" :class="{'is-loading': searching}" @click="search">Search</button>
            </div>
        </div>
    </div>
</template>

<script>
	import Map, { LeafletMapService } from '@/services/leaflet.service';

	export default {
		name: "search-bar",

		data() {
			return {
				geocoder: null,
				query: '',
				searching: false,
				results: []
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

				this.searching = false;
			},

			moveMap(latLng) {
				Map.move(latLng);
			}
		}
	}
</script>

<style lang="scss" scoped>
    @import "~$scss/variables";

    .dashboard__control {
        display: flex;
        align-items: center;
    }

    .dropdown-item {
        white-space: normal;
    }
</style>
<template>
	<div class="marker-border-filter" :class="{'marker-border-filter--open' :open}">
		<div class="is-hidden-tablet">
			<button class="button is-light is-outlined is-faded is-fullwidth marker-border-filter__open" @click="open = !open">
				<FontAwesomeIcon icon="sliders-h" size="sm"/>
			</button>
		</div>
		<div class="buttons has-addons is-marginless">
			<button class="button is-light is-outlined is-marginless is-faded has-icon-top marker-border-filter__button"
					@click="setBorders"
					:disabled="location === 'current'">
				<FontAwesomeIcon icon="map-marked" size="sm"/>
				<span class="is-size-7">Only Here</span>
			</button>
			<button class="button is-light is-outlined is-marginless is-faded has-icon-top marker-border-filter__button"
					@click="clearBorders"
					:disabled="location === 'everywhere'">
				<FontAwesomeIcon icon="globe-asia" size="sm"/>
				<span class="is-size-7">Everywhere</span>
			</button>
		</div>
	</div>
</template>

<script>
	import Map from '@/Services/LeafletMapService';

	export default {
		name: "MarkerBordersFilter",

		data() {
			return {
				location: 'everywhere',
				open: false
			}
		},

		mounted() {
			Map.on('moveend', this.onMoveEnd.bind(this));
		},

		methods: {
			onMoveEnd() {
				if (this.location !== 'everywhere') {
					this.location = 'changed';
				}
			},
			setBorders() {
				const borders = Map.getBorders();
				this.$store.commit('Markers/setBorders', [
					borders._southWest,
					borders._northEast
				]);
				this.$store.dispatch('Markers/load');
				this.location = 'current';
			},

			async clearBorders() {
				this.$store.commit('Markers/setBorders', false);
				this.location = 'everywhere';
				await this.$store.dispatch('Markers/load');
				return Map.setView([this.$store.state.Markers.markers[0].lat, this.$store.state.Markers.markers[0].lng], 16);

			}
		}
	}
</script>

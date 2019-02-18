<template>
	<div class="buttons has-addons is-marginless">
		<slot></slot>
		<button class="button is-light is-outlined is-marginless is-faded has-icon-top" @click="setBorders"
				:disabled="location === 'current'">
			<font-awesome-icon icon="map-marked" size="sm"/>
			<span class="is-size-7">Only Here</span>
		</button>
		<button class="button is-light is-outlined is-marginless is-faded has-icon-top" @click="clearBorders"
				:disabled="location === 'everywhere'">
			<font-awesome-icon icon="globe-asia" size="sm"/>
			<span class="is-size-7">Everywhere</span>
		</button>
	</div>
</template>

<script>
	import map from '@/Services/LeafletMapService';

	export default {
		name: "MarkerBordersFilter",

		data() {
			return {
				location: 'everywhere'
			}
		},

		mounted() {
			map.on('moveend', this.onMoveEnd.bind(this));
		},

		methods: {
			onMoveEnd() {
				if (this.location !== 'everywhere') {
					this.location = 'changed';
				}
			},
			setBorders() {
				const borders = map.getBorders();
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
				return map.setView([this.$store.state.Markers.markers[0].lat, this.$store.state.Markers.markers[0].lng], 16);

			}
		}
	}
</script>

<style scoped lang="scss">
	.button {
		height: 100%;
	}
</style>

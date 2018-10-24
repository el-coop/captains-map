<template>
	<div class="buttons has-addons is-marginless">
		<slot></slot>
		<button class="button is-light is-outlined is-marginless" @click="setBorders"
				:disabled="location === 'current'">Only Here
		</button>
		<button class="button is-light is-outlined is-marginless" @click="clearBorders"
				:disabled="location === 'everywhere'">Everywhere
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
	@import "~$scss/variables";

	.button {
		flex: 1;
		height: 100%;

		&.is-light.is-outlined {
			border-color: rgba(219, 219, 219, 0.5);
		}

	}
</style>
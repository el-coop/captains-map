<template>
	<div :class="`map__icon-wrapper map__marker map__marker--${status}`">
		<img :src="path" :class="`map__icon-${marker.type} map__icon-${status}`" :alt="`${marker.type}`">
	</div>
</template>

<script>
	import MapObjectMixin from '@/Components/Map/MapObjectMixin';
	import leaflet from 'leaflet';

	export default {
		name: "upload-marker",
		mixins: [MapObjectMixin],

		props: {
			marker: {
				type: Object,
				required: true,
			},
			status: {
				type: String,
				default: 'upload'
			}
		},

		data() {
			return {
				event: 'marker-click',
				payload: this.marker,
				lat: this.marker.lat,
				lng: this.marker.lng,
			}
		},

		methods: {
			prepareMapObject(lat, lng) {
				lat = this.lat;
				lng = this.lng;
				this.mapObject = leaflet.marker([lat, lng], {
					icon: leaflet.divIcon({
						html: this.$el.outerHTML,
						iconSize: [this.iconSize, this.iconSize]
					})
				}).on('click', this.onClick.bind(this));
				this.mapObject.id = this.marker.id;
			},

			async onClick() {
				this.$bus.$emit('map-right-click', {
					lat: this.lat,
					lng: this.lng
				});
				await this.$nextTick();
				this.$bus.$emit('edit-marker', this.marker);
			}

		},

		computed: {
			path() {
				if (this.marker['media[type]'] === 'instagram') {
					const regex = new RegExp(/https:\/\/www\.instagram\.com\/p\/(\w*)\/.*/i);
					const path = regex.exec(this.marker['media[path]']);
					if (path) {
						return `https://instagram.com/p/${path[1]}/media/`;
					} else {
						return '';
					}
				}
				return 'data:image/jpeg;base64,' + btoa(this.marker['media[image]']);
			}
		},
	}
</script>

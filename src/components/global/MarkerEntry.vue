<template>
    <div class="media" @click="showMarker">
        <figure class="media-left">
            <p class="image">
                <img :src="'/api' + marker.media.path">
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <small>Type:&nbsp;</small>
                <strong v-text="marker.type"></strong>
                <br>
                <p v-text="marker.description"></p>
            </div>
        </div>
    </div>
</template>

<script>
	import Map from '@/services/leaflet.service';

	export default {
		name: "marker-entry",

		props: {
			marker: {
				type: Object,
				required: true
			}
		},

		data() {
			return {
				image: null
			}
		},


		methods: {
			showMarker() {
				this.$bus.$emit('moving-map');
				Map.move([this.marker.lat, this.marker.lng], 16);
			}
		}
	}
</script>

<style lang="scss" scoped>
    @import "~$scss/variables";

    .media {
        width: 100%;
        cursor: pointer;
        padding: 0.5rem;

        &:hover {
            background-color: $grey-light;
        }
    }

    .image {
        width: 64px;
    }

    strong {
        color: white;
    }
</style>
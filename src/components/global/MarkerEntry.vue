<template>
    <div class="media" :class="marker.type" @click="showMarker">
        <figure class="media-left">
            <p class="image">
                <img :src="src">
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
				image: null,
				src: null
			}
		},

		mounted() {
			if (this.marker.media.type == 'instagram') {
				this.src = `https://instagram.com/p/${this.marker.media.path}/media/`;
			} else {
				this.src = `/api${this.marker.media.path}`;
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
            &.Plan {
                background-color: $cyan;
            }
            &.Visited {
                background-color: $turquoise;
            }
            &.Suggestion {
                background-color: $red;
            }
            background-color: $grey-light;
        }
    }

    .image {
        width: 64px;
    }

    strong {
        color: $white;
    }
</style>
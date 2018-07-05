<template>
    <div class="media" @click="showMarker">
        <figure class="media-left">
            <p class="image">
                <img :src="image">
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <small>Type:&nbsp;</small>
                <strong v-html="marker.type"></strong>
                <br>
                <p v-html="marker.description">

                </p>
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

		async mounted() {
			let file = await this.readFile(this.marker.file);
			this.image = file.target.result;

		},

		methods: {
			readFile(file) {
				return new Promise((resolve, reject) => {
					let reader = new FileReader();
					reader.onload = resolve;
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});
			},

			showMarker() {
				Map.move(this.marker.latLng, 16);
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
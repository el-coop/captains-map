<script>
import leaflet from 'leaflet';
import MapMarker from "@/Components/Map/Markers/MapMarker.vue";

export default {
    name: "MapUploadMarker",
    extends: MapMarker,
    emits: ['map-create-marker'],
    
    mounted() {
        this.setStatus();
    },
    
    methods: {
        calculateSrc() {
            return this.calculateUnverifiedImage(this.marker)
        },
        
        async onClick() {
            if (!this.marker.error) {
                return;
            }
            this.$emit('map-create-marker', {
                latlng: {
                    lat: this.lat,
                    lng: this.lng,
                },
                marker: this.marker,
            });
        },
        
        setStatus() {
            if (this.$store.state.Uploads.workingId === this.marker.uploadTime) {
                setTimeout(() => {
                    this.removeClass('map__marker--error');
                    this.removeClass('map__marker--queued');
                    this.addClass('map__marker--uploading');
                }, 5);
            } else if (this.marker.error) {
                setTimeout(() => {
                    this.removeClass('map__marker--uploading');
                    this.removeClass('map__marker--queued');
                    this.addClass('map__marker--error');
                }, 5);
            } else {
                setTimeout(() => {
                    this.removeClass('map__marker--error');
                    this.removeClass('map__marker--uploading');
                    this.addClass('map__marker--queued');
                }, 5);
            }
        }
    },
    
    watch: {
        '$store.state.Uploads.workingId'() {
            this.setStatus();
        },
        
        async 'marker.media'() {
            this.src = this.calculateUnverifiedImage(this.marker);
            await this.$nextTick();
            this.setIcon(
                leaflet.divIcon({
                    html: this.$el.outerHTML,
                    iconSize: [this.iconSize, this.iconSize]
                })
            );
        },
        
        'marker.error'() {
            this.setStatus();
        }
    }
}
</script>

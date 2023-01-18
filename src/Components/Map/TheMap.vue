<template>
    <div :class="zoomStatus">
        <div class="map" ref="map">
            <MapUserMarkerControl key="userMarkerController"
                                  @add-to-map="addObject"
                                  @remove-from-map="removeObject"
                                  @go-to-user-marker="goToUserMarker"/>
            <MapUserMarker v-if="userMarker" key="userMarker" ref="userMarker"
                           @add-to-map="addObject"
                           @remove-from-map="removeObject"
                           @user-marker-click="rightClick"/>
            
            <template v-if="$route.name === 'edit'">
                <MapUploadMarker v-for="marker in uploadMarkers" :marker="marker"
                                 @add-to-map="addObject"
                                 @remove-from-map="removeObject"
                                 @map-create-marker="rightClick"
                                 :key="`uploads_${marker.uploadTime}`"/>
            </template>
            <MapMarkerCluster key="cluster"
                              ref="cluster"
                              @remove-from-map="removeObject"
                              @add-to-map="addObject">
                <MapMarker v-for="marker in markers" :marker="marker"
                           @add-to-map="addObjectToCluster"
                           @remove-from-map="removeObjectFromCluster"
                           :key="`marker_${marker.id}`" @marker-click="$emit('marker-click', $event)"/>
            </MapMarkerCluster>
        </div>
    </div>
</template>

<script>

import Map from '@/Services/LeafletMapService';
import MapUserMarkerControl from "@/Components/Map/Controls/MapUserMarkerControl.vue";
import MapUserMarker from '@/Components/Map/Markers/MapUserMarker.vue';
import MapUploadMarker from "@/Components/Map/Markers/MapUploadMarker.vue";

import MapMarker from '@/Components/Map/Markers/MapMarker.vue';
import MapMarkerCluster from "@/Components/Map/Layers/MapMarkerCluster.vue";

export default {
    name: "TheMap",
    
    components: {
        MapUserMarkerControl,
        MapUploadMarker,
        MapMarkerCluster,
        MapMarker,
        MapUserMarker
    },
    emits: ['marker-click', 'map-create-marker'],
    
    props: {
        center: {
            type: Array,
            default() {
                return [0, 0];
            }
        },
        zoom: {
            type: Number,
            default: 10
        },
    },
    
    data() {
        return {
            zoomStatus: 'map--zoom-normal',
            initialized: false
        }
    },
    
    methods: {
        goToUserMarker() {
            this.$refs.userMarker.goToMarker();
        },
        rightClick(event) {
            this.$emit('map-create-marker', {
                event
            });
        },
        
        handleZoom(event) {
            let zoomLevel = event.target._animateToZoom;
            if (zoomLevel < 5) {
                return this.zoomStatus = 'map--zoom-far';
            }
            if (zoomLevel < 10) {
                return this.zoomStatus = 'map--zoom-medium';
            }
            if (zoomLevel < 15) {
                return this.zoomStatus = 'map--zoom-normal';
            }
            return this.zoomStatus = 'map--zoom-close';
        },
        
        addObject(object) {
           Map.addObject(object);
        },
        removeObject(object) {
            Map.removeObject(object);
        },
        addObjectToCluster(object){
            this.$refs.cluster.addObject(object)
        },
        removeObjectFromCluster(object){
            this.$refs.cluster.removeObject(object)
        }
    },
    
    
    computed: {
        markers() {
            if (this.$store.state.Stories.story) {
                return this.$store.state.Stories.markers;
            }
            const start = this.$store.state.Markers.page * import.meta.env.VITE_APP_PAGE_SIZE;
            const end = this.$store.state.Markers.page * import.meta.env.VITE_APP_PAGE_SIZE + import.meta.env.VITE_APP_PAGE_SIZE;
            return this.$store.state.Markers.markers.slice(start, end);
        },
        userMarker() {
            return this.$store.state.Markers.userMarker;
        },
        uploadMarkers() {
            return this.$store.getters['Uploads/allFiles'];
        },
    },
    
    mounted() {
        Map.init(this.$refs.map, this.center, this.zoom);
        Map.on('contextmenu', this.rightClick);
        Map.on('zoomend', this.handleZoom);
    },
    
    beforeUnmount() {
        Map.off();
    },
}
</script>

<template>
    <div class="layout">
        <TheDashboard :selectedMarker="selectedMarker" @close="$emit('update:selectedMarker',null)"/>
    </div>
</template>

<script>
import TheDashboard from "@/Components/Dashboard/TheDashboard.vue";
import map from '@/Services/LeafletMapService';
import LoadsMarkersMixin from "@/Views/LoadsMarkersMixin.vue";

export default {
    name: "ViewPage",
    emits:['update:selectedMarker','404'],
    metaInfo() {
        return {
            title: this.$route.params.username || 'Home'
        }
    },
    
    mixins: [LoadsMarkersMixin],
    
    components: {
        TheDashboard,
    },
    
    props: {
        selectedMarker: {}
    },
    
    
    methods: {
        envSetup() {
            this.$store.commit('Stories/exit');
            this.$store.commit('Markers/setUser', this.$route.params.username || '');
            if (this.$route.params.username) {
                this.$store.dispatch('Profile/load', this.$route.params.username);
            }
        },
        
        markersLoaded() {
            const markers = this.$store.state.Markers.markers;
            
            if (!markers.length) {
                return map.goToCurrentLocation();
            }
            
            if (!this.$route.params.marker) {
                return map.setView([markers[0].lat, markers[0].lng]);
            }
            
            const marker = markers.find(({id}) => {
                return id == this.$route.params.marker;
            });
            
            if (marker) {
                return map.setView([marker.lat, marker.lng], 16);
            }
            
            return this.$emit('404');
            
        }
    },
    
    computed: {
        payload() {
            return {
                startingId: this.$route.params.marker || false,
                pageIncluding: true
            }
        }
    },
    
    watch: {
        $route() {
            this.envSetup();
            this.loadMarkers();
        }
    }
}
</script>

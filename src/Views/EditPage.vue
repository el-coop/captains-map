<template>
    <div class="layout">
        <TheDashboard :selectedMarker="selectedMarker" @close="$emit('update:selectedMarker',null)"/>
        <CreateMarker :editData="createMarkerData" @close="$emit('update:createMarkerData', null)"/>
    </div>
</template>

<script>
import TheDashboard from '@/Components/Dashboard/TheDashboard';
import map from '@/Services/LeafletMapService';
import LoadsMarkersMixin from "@/Views/LoadsMarkersMixin";
import CreateMarker from "@/Components/Modals/CreateMarker";

export default {
    name: "EditPage",
    metaInfo: {
        title: 'Edit'
    },
    emits:['update:selectedMarker','update:createMarkerData'],
    
    mixins: [LoadsMarkersMixin],
    
    components: {
        TheDashboard, CreateMarker
    },
    
    props: {
        selectedMarker: {},
        createMarkerData: {}
    },
    
    
    methods: {
        
        envSetup() {
            const username = this.$store.state.User.user.username;
            this.$store.commit('Stories/exit');
            this.$store.commit('Markers/setUser', username);
            this.$store.dispatch('Profile/load', username);
        },
        
        async markersLoaded() {
            map.goToCurrentLocation();
        },
    },
    
}
</script>

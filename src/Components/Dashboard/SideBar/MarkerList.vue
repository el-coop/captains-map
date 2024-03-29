<template>
    <div class="marker-list__wrapper">
        <UploadsList
            v-if="! loading && showUploads"/>
        <div v-if="loading" class="marker-list__loader">
            <div class="is-loading"></div>
        </div>
        <ul v-if="!loading" class="marker-list">
            <li v-if="hasPrev">
                <button class="marker-list__button marker-list__button--prev button is-faded" @click="previousPage">
                    Load Previous
                </button>
            </li>
            <li v-for="marker in markers" class="marker-list__entry" :key="marker.id">
                <MarkerEntry :marker="marker"/>
            </li>
            <li v-if="hasNext">
                <button class="marker-list__button marker-list__button--next button is-faded" @click="nextPage">
                    Load Next
                </button>
            </li>
        </ul>
        <slot v-if="! loading"/>
    </div>
</template>

<script>
import MarkerEntry from "@/Components/Dashboard/SideBar/MarkerEntry.vue";
import MarkerBordersFilter from "@/Components/Utilities/MarkerBordersFilter.vue";
import UploadsList from "@/Components/Dashboard/SideBar/UploadsList.vue";

const pageSize = parseInt(import.meta.env.VITE_APP_PAGE_SIZE);

export default {
    name: "MarkerList",
    components: {MarkerBordersFilter, MarkerEntry, UploadsList},
    
    computed: {
        markers() {
            if (this.$store.state.Stories.story) {
                return this.$store.state.Stories.markers;
            }
            const start = this.$store.state.Markers.page * pageSize;
            const end = this.$store.state.Markers.page * pageSize + pageSize;
            return this.$store.state.Markers.markers.slice(start, end);
        },
        hasNext() {
            if (this.$store.state.Stories.story) {
                return false;
            }
            const pageEnd = this.$store.state.Markers.page * pageSize + pageSize;
            return this.$store.state.Markers.hasNext || pageEnd < this.$store.state.Markers.markers.length;
        },
        hasPrev() {
            if (this.$store.state.Stories.story) {
                return false;
            }
            return this.$store.state.Markers.page > 0 || this.$store.state.Markers.serverPage > 0;
        },
        loading() {
            return this.$store.state.Markers.loading || this.$store.state.Stories.loading;
        },
        
        showUploads() {
            const storyId = this.$store.state.Stories.story ? this.$store.state.Stories.story.id : null;
            const uploadsLength = this.$store.getters['Uploads/allFiles'].filter((marker) => {
                return marker.story == storyId;
            }).length;
            
            if (! uploadsLength) {
                return false
            }
            
            const user = this.$store.state.User.user;
            
            return this.$route.name === 'edit' || (this.$store.state.Stories.story && user && this.$store.state.Stories.story.user_id === user.id);
        }
    },
    
    
    methods: {
        async previousPage() {
            await this.$store.dispatch('Markers/previousPage');
            this.$el.scrollLeft = 0;
        },
        async nextPage() {
            await this.$store.dispatch('Markers/nextPage');
            this.$el.scrollLeft = 0;
        },
    }
}
</script>

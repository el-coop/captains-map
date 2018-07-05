<template>
    <div class="dashboard">
        <search-bar class="dashboard__header"/>
        <div class="dashboard__body">
            <profile/>
            <div class="dashboard__control sidebar">
                <marker-list/>
            </div>
        </div>
        <modal name="create-marker" :adaptive="true" :height="'auto'">
            <create-marker :latLng="latLng" @close-modal="$modal.hide('create-marker')"/>
        </modal>
    </div>
</template>

<script>
	import Profile from '@/components/edit/Profile';
	import SearchBar from '@/components/edit/SearchBar';
	import CreateMarker from '@/components/edit/CreateMarker';
	import MarkerList from "../global/MarkerList";

	export default {
		name: "edit-dashboard",

		components: {
			MarkerList,
			Profile,
			SearchBar,
			CreateMarker,
		},

		data() {
			return {
				latLng: null
			}
		},

		created() {
			this.$bus.$on('map-right-click', this.createMarker);
		},
		beforeDestroy() {
			this.$bus.$off('map-right-click');
		},

		methods: {
			createMarker(data) {
				this.latLng = data.event.latlng;
				this.$modal.show('create-marker');
			}
		}
	}
</script>

<style scoped>
    .sidebar {
        height: 100%;
        width: 500px;
        max-width: 20vw;
    }

</style>
<template>
    <div class="marker-entry__card" :class="className" @click="showMarker" :style="uploadingStyle || ''">
        <img :src="src" :alt="imageAlt" class="marker-entry__card-image">
        <div class="marker-entry__card-tags">
            <template v-if="marker.location">
                <br>
                <strong>{{ truncate(textAfterLine(marker.location), 40) }}</strong>
            </template>
            <br>
            <small class="has-text-weight-semibold" v-text="dateDisplay(marker.time)"/>
        </div>
        <FontAwesomeIcon icon="images" v-if="marker.media.length > 1" class="marker-entry__card-icon"/>
        <div class="marker-entry__card-text">
            <div class="marker-entry__card-profile">
                <img :src="profileImg" class="marker-entry__card-profile-img">
                <span v-text="user.username"/>
            </div>
            <p class="marker-entry__card-content" v-text="description"/>
        </div>
        <progress v-if="className === 'uploading'" class="progress marker-entry__card-progress is-dark"
                  :value="progress" max="100"
                  v-text="`${progress}%`"/>
    </div>
</template>

<script>
import map from '@/Services/LeafletMapService';
import HandlesDataDisplayMixin from "@/Components/Utilities/HandlesDataDisplayMixin.vue";
import globe from '../../../assets/images/globe-icon.png';

export default {
    name: "MarkerEntry",
    mixins: [HandlesDataDisplayMixin],
    
    props: {
        marker: {
            type: Object,
            required: true
        }
    },
    
    async created() {
        this.src = await this.calculateImage();
    },
    
    mounted() {
        this.resizeDescription();
        window.addEventListener('resize', this.resizeDescription);
    },
    
    beforeUnmount() {
        window.removeEventListener('resize', this.resizeDescription);
    },
    
    data() {
        return {
            resizeListener: null,
            src: null,
            className: `marker-entry__card--${this.marker.type}`,
            description: '',
            user: this.marker.user
        }
    },
    
    computed: {
        imageAlt() {
            let text = '';
            if (this.user) {
                text = `${this.user.username} `;
            }
            return text + this.marker.type;
        },
        profileImg() {
            return this.user.bio.path ? `/api${this.user.bio.path}` : globe;
        },
        uploadingStyle() {
            return '';
        }
    },
    
    methods: {
        async calculateImage() {
            if (!this.marker.media || !this.marker.media.length) {
                return '';
            }
            
            return await this.calculateVerifiedImage(this.marker.media[0]);
        },
        showMarker() {
            map.move([this.marker.lat, this.marker.lng], 16);
        },
        resizeDescription() {
            let length = 45;
            if (window.matchMedia("(min-width: 1950px)").matches) {
                length = 75;
            } else if (window.matchMedia("(min-width: 1520px)").matches) {
                length = 60;
            }
            this.description = this.truncate(this.marker.description, length);
        }
        
    },
}
</script>

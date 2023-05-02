<template>
    <figure class="image view-marker__image">
        <img :src="`/api/marker/instagram/${instagram_type || 'p'}/${this.path}`" :alt="alt" class="view-marker__image-img">
        <button class="button is-light-background view-marker__image-button" @click="openImage">
            <FontAwesomeIcon icon="camera-retro" fixed-width></FontAwesomeIcon>
        </button>
    </figure>
</template>

<script>
export default {
    name: "Instagram",
    
    props: {
        path: {
            required: true,
            type: String
        },
    
        instagram_type: {
            required: false,
            default: 'p'
        },
        alt: {
            type: String,
            default: ''
        }
    },
    
    methods: {
        openImage() {
            window.open(`https://www.instagram.com/p/${this.path}/`);
        }
    }
}
</script>

<template>
    <figure class="image view-marker__image">
        <img :src="`/api/marker/instagram/${this.id}`" :alt="alt" class="view-marker__image-img">
        <button class="button is-light-background view-marker__image-button" @click="openImage">
            <FontAwesomeIcon icon="camera-retro" fixed-width></FontAwesomeIcon>
        </button>
    </figure>
</template>

<script>
export default {
    name: "Instagram",
    
    props: {
        id: {
            required: true,
            type: Number
        },
        path: {
            required: true,
            type: String
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

<template>
    <BaseModal v-model:active="modal" @close="$emit('close')">
        <template #header>
            <p class="card__header-title">Edit Image</p>
        </template>
        <template #image>
            <figure class="image view-marker__image" :class="{'is-loading': loading}">
                <img :src="preview" class="view-marker__image-img" >
                <button class="button is-selected-background view-marker__image-button" @click="rotateImage"
                        type="button">
                    <FontAwesomeIcon icon="undo" fixed-width/>
                </button>
            </figure>
        </template>
        <template #footer>
            <p class="card__footer-item">
                <button class="button is-primary-background is-fullwidth" type="button" @click="saveChanges">
                    Done
                </button>
            </p>
            <p class="card__footer-item">
                <button class="button is-danger-background is-fullwidth" type="button" @click="deleteMarker">
                    Delete
                </button>
            </p>
        </template>
    </BaseModal>
</template>

<script>
import BaseModal from "@/Components/Utilities/BaseModal";

export default {
    name: "EditImage",
    components: {BaseModal},
    emits: ['close','save','delete'],
    props: {
        image: {
            default: null
        }
    },
    data() {
        return {
            modal: false,
            rotation: 0,
            preview: null,
            loading: false
        }
    },
    methods: {
        async rotateImage() {
            this.loading = true;
            this.rotation += 90;
            if (this.rotation === 360) {
                this.rotation = 0;
            }
            this.preview = await this.image.rotatedPreview(this.rotation);
            this.loading = false;
        },
        saveChanges() {
            const changes = {
                rotation: this.rotation
            }
            this.$emit('save', changes);
        },
        deleteMarker() {
            this.$emit('delete');
        },
        closeModal(){
            this.modal = false;
            this.rotation = 0;
            this.preview = null;
        }
    },
    watch: {
        async image(value) {
            if (value) {
                this.modal = true;
                this.preview = await value.rotatedPreview();
                return;
            }
            this.closeModal();
        }
    }
}
</script>

<style scoped>

</style>
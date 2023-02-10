<template>
    <div class="profile-open">
        <button class="profile-open__button button " @click="edit = true">
            <FontAwesomeIcon icon="edit" class="icon" v-if="canEdit"/>
            <StoryCoverImage :cover="story.cover" :is-small="true"/>
            <span class="is-size-7-tablet profile-open__button-text"
                  v-text="story.name"/>
        </button>
        <button @click="shareStory" class="webpush button is-wide story__bar-button" v-if="story.published === 'true'">
            <FontAwesomeIcon icon="share-alt" class="icon"/>
        </button>
        
        <button @click="exitStory" class="webpush button is-wide">
            <FontAwesomeIcon icon="times-circle" class="icon"/>
        </button>
        
        <StoryEditModal v-if="canEdit" v-model:active="edit" :story="story" @saved="storySaved"/>
    </div>
</template>

<script>
import StoryEditModal from "@/Components/Modals/StoryEditModal.vue";
import StoryCoverImage from "@/Components/Dashboard/Profile/StoryCoverImage.vue";

export default {
    name: "StoriesOpen",
    components: {StoryCoverImage, StoryEditModal},
    
    data() {
        return {
            edit: false
        }
    },
    
    computed: {
        story() {
            return this.$store.state.Stories.story;
        },
        canEdit() {
            
            return !!(this.$store.state.User.user && this.$route.params.username === this.$store.state.User.user.username);
        }
    },
    
    methods: {
        storySaved() {
            this.edit = false;
        },
        async shareStory() {
            const url = window.location.href;
            
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: '',
                        text: '',
                        url: url,
                    });
                    return;
                } catch (error) {
                }
                
            }
            
            await navigator.clipboard.writeText(url);
            this.$toast.info('You can paste it anywhere', 'Link copied');
            
        },
        exitStory() {
            this.$store.commit('Profile/trackStory', this.$store.state.Stories.story);
            if (window.history.state.back) {
                this.$router.go(-1);
            } else {
                this.$router.push(`/${this.$route.params.username}`);
            }
        },
    }
}
</script>

<style lang="scss">
.story__bar-button {
    position: relative;
    
    &:after {
        position: absolute;
        right: 0;
        content: ' ';
        border: var(--background-muted-er) solid 1px;
        height: 50%;
    }
}
</style>
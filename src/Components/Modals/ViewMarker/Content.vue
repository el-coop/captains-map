<template>
	<div class="view-marker__content">
		<div class="view-marker__content-text">
			<p v-if="marker.location" v-text="marker.location"
			   class="view-marker__content-text-location"/>
			<p v-text="marker.description"/>
		</div>
		<div class="view-marker__content-buttons">
			<button class="button is-dark view-marker__content-button" @click="shareLink">
				<FontAwesomeIcon icon="share-alt" size="lg"/>
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: "ViewMarkerContent",
		props: {
			marker: {
				type: Object
			},
		},

		data() {
			return {
				link: this.$router.resolve(`/${this.marker.user.username}/${this.marker.id}`).href,
				hasShare: navigator.share,
			}
		},

		methods: {
		    async shareLink(){
                const url = `${window.location.protocol}//${window.location.host}${this.link}`;
            
                if (this.hasShare) {
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
            
                await navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${this.link}`);
                this.$toast.info('You can paste it anywhere', 'Link copied');
            },
            
		},
	}
</script>

<template>
    <slide-up-modal name="view-marker">
        <template v-if="marker">
            <div slot="header" class="card-header-title">
                <div class="media">
                    <div class="media-left">
                        <img class="profile-image" :src="profile.image"/>
                    </div>
                    <div class="media-content">
                        <p class="is-4" v-text="marker.user.username"/>
                        <p class="is-7 has-text-weight-normal" v-text="marker.type"/>
                        <p class="is-7 has-text-weight-light has-text-grey-lighter">{{ marker.time | moment("calendar",
                            null, {
                            sameElse: 'DD/MM/YYYY HH:mm'
                            }) }}</p>
                    </div>
                </div>
            </div>
            <component slot="image" :is="marker.media.type === 'instagram' ? 'Instagram': 'Photo'"
                       :path="marker.media.path" @instagram-loaded="$bus.$emit('fix-modal')"/>
            <template slot="content">
                <div class="columns">
                    <div class="column is-11">
                        <div class="content">
                            <p v-text="marker.description"></p>
                        </div>
                    </div>
                    <div class="column">
                        <button class="button is-dark is-rounded" @click="copyLink">
                            <span class="icon">
                                <font-awesome-icon icon="copy"/>
                            </span>
                        </button>
                    </div>
                </div>
            </template>
            <template slot="footer">
                <p class="card-footer-item">
                    <a @click="$modal.hide('view-marker')">Close</a>
                </p>
                <p class="card-footer-item" v-if="canDelete">
                    <button class="button is-danger is-fullwidth" @click="deleteMarker"
                            :class="{'is-loading': deleting}">
                        Delete
                    </button>
                </p>
            </template>
        </template>
    </slide-up-modal>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';
	import SlideUpModal from "./slide-up-modal";
	import Auth from '@/services/authentication.service';
	import Photo from './media/photo';
	import Instagram from './media/instagram';

	export default {
		name: "view-marker",
		components: {SlideUpModal, Photo, Instagram},
		props: {
			marker: {
				type: Object
			},
			profile: {
				type: Object,
				default() {
					return {
						image: globe
					}
				}
			}
		},

		data() {
			return {
				deleting: false
			}
		},

		methods: {
			async deleteMarker() {
				this.deleting = true;
				const response = await this.$store.dispatch('Markers/delete', this.marker.id);
				this.deleting = false;
				if (response) {
					return this.$modal.hide('view-marker');
				}
			},

			async copyLink() {
				let link = this.$router.resolve(`/${this.marker.user.username}/${this.marker.id}`).href;
				await this.$copyText(`${window.location.protocol}/${window.location.host}/${link}`);
				this.$snotify.info('You can paste it anywhere', 'Link copied', {
					timeout: 2000,
					showProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
					position: "centerBottom"
				});
			}
		},

		computed: {
			canDelete() {
				let user = Auth.getUserDetails();
				return user && user.id === this.marker.user_id
			}
		}
	}
</script>

<style lang="scss" scoped>
    @import "~$scss/variables";

    .profile-image {
        max-height: 50px;
        max-width: 50px;
    }

    .image > img {
        max-height: 400px;
        height: auto;
        max-width: 100%;
    }

    .dashboard__control--dark {
        margin-bottom: 0.2rem;
    }

    hr {
        margin: 0.5rem 0 0;
    }
</style>
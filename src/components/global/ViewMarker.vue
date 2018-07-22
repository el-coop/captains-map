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
            <figure class="image" slot="image">
                <img :src="'api' + marker.media.path">
            </figure>
            <template slot="content">
                <div class="content">
                    <p v-text="marker.description"></p>
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
	import auth from '@/services/authentication.service';

	export default {
		name: "view-marker",
		components: {SlideUpModal},
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
				let response = await this.$http.delete(`marker/${this.marker.id}`);
				if (response) {
					this.$store.commit('deleteMarker', this.marker);
					this.$modal.hide('view-marker');
				}
			}
		},

		computed: {
			canDelete() {
				return auth.getUserDetails() && auth.getUserDetails().id === this.marker.user_id
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
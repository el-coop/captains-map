<template>
    <div class="card dashboard__control">
        <div class="card-content dashboard__control--dark">
            <div class="media">
                <div class="media-left">
                    <img class="profile-image" :src="profile.image"/>
                </div>
                <div class="media-content">
                    <p class="title is-4">Nur Bar</p>
                    <p class="subtitle is-6">@nbar</p>
                </div>
                <div class="media-right">
                    <p>
                        <strong v-text="marker.type"></strong>
                    </p>
                    <p>{{ marker.time | moment("calendar", null, {
                        sameElse: 'DD/MM/YYYY HH:mm'
                        }) }}</p>
                </div>
            </div>
        </div>
        <div class="card-image">
            <figure class="image">
                <img :src="'api' + marker.media.path">
            </figure>
        </div>
        <hr>
        <div class="card-content">
            <div class="content">
                <p v-text="marker.description"></p>
            </div>
            <div class="field is-grouped">
                <p class="control is-expanded">
                    <button class="button is-dark is-fullwidth" @click="$modal.hide('edit-marker')">Close</button>
                </p>
                <p class="control is-expanded">
                    <button class="button is-danger is-fullwidth" @click="deleteMarker"
                            :class="{'is-loading': deleting}">
                        Delete
                    </button>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';

	export default {
		name: "edit-marker",

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
				let response = await this.$http.delete(`marker//edit/${this.marker.id}`);
				this.$store.commit('deleteMarker', this.marker);
				this.$modal.hide('edit-marker');
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
    }

    .dashboard__control--dark {
        margin-bottom: 0.2rem;
    }

    hr {
        margin: 0.5rem 0 0;
    }
</style>
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
            <div class="field">
                <p class="control is-expanded has-text-right">
                    <button class="button is-dark" @click="$modal.hide('view-marker')">Close</button>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';

	export default {
		name: "view-marker",

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
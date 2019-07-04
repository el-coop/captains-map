<template>
	<div class="dashboard__control profile" :class="{'profile--open': isOpen}">
		<component :is="isEdit ? 'ajax-form' : 'div'" class="media profile__media h-100"
				   method="post" :action="`bio/${user.username}`"
				   @submitting="submitting"
				   :headers="formHeaders"
				   @submitted="displayResponse">
			<div class="media-left profile__media-left">
				<template v-if="isEdit">
					<FileField name="image" v-model="file" :init-preview="imageSrc">
					</FileField>
					<button class="button is-fullwidth is-danger" type="button" @click="file = null" v-if="file">Reset
					</button>
				</template>
				<figure class="image profile__media-image is-128x128" v-else>
					<img :src="imageSrc">
				</figure>
			</div>
			<div class="media-content profile__media-content is-flex-1">
				<div class="is-flex-column h-100">
					<h4 class="title is-4" v-text="user.username"></h4>
					<template v-if="isEdit">
						<div class="field is-flex-1">
							<textarea v-model="description" name="description" class="textarea profile__media-textarea h-100"></textarea>
						</div>
						<button class="button is-primary is-fullwidth" :class="{'is-loading': loading}">Save</button>
					</template>
					<p class="is-flex-1 profile__media-content-text" v-else v-text="user.description"></p>
				</div>
			</div>
			<div class="media-right is-hidden-touch">
				<span class="icon profile__close" @click="$store.commit('Profile/toggle')">
					<FontAwesomeIcon icon="times-circle"/>
				</span>
			</div>
		</component>
	</div>
</template>

<script>
	import globe from '../../assets/images/globe-icon.png';
	import AjaxForm from "@/Components/Utilities/AjaxForm";
	import Auth from '@/Services/AuthenticationService';
	import FileField from '@/Components/Modals/CreateMarker/FileField';

	export default {
		name: "Profile",
		components: {AjaxForm, FileField},
		data() {
			return {
				logo: globe,
				description: '',
				loading: false,
				file: null,
				formHeaders: {
					'Content-Type': 'multipart/form-data'
				},
			}
		},

		methods: {
			displayResponse(response) {
				this.loading = false;
				if (response.status > 199 && response.status < 300) {
					this.$toast.success(' ', 'Profile updated.');
					if (this.user.path !== response.data.path) {
						this.$store.commit('Markers/updateProfilePic', {
							username: this.user.username,
							path: response.data.path
						});
					}
					this.$store.commit('Profile/updateBio', {
						username: this.user.username,
						description: response.data.description,
						path: response.data.path
					});
					this.file = null;
				} else {
					this.$toast.error('Please try again at a later time', 'Update failed.');
				}
			},
			submitting() {
				this.loading = true;
			}
		},

		computed: {
			isEdit() {
				if (!Auth.getUserDetails() || !this.user.username) {
					return false;
				}
				return Auth.getUserDetails().username === this.user.username;
			},
			isOpen() {
				return this.$store.state.Profile.open;
			},
			user() {
				if (this.$store.state.Profile.user) {
					this.description = this.$store.state.Profile.user.description;
				}
				return this.$store.state.Profile.user;
			},

			imageSrc() {
				return this.user.path ? `/api${this.user.path}` : globe;
			}
		},
	}
</script>

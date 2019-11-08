<template>
	<Profile>
		<template #image>
			<MultiFileField :limit="1" name="image" v-model="file" :preview="imageSrc" class="profile__image-field"/>
		</template>
		<template #content>
			<textarea v-model.lazy="description" name="description"
					  class="textarea field profile__textarea"></textarea>
			<button class="button is-primary-background is-fullwidth" :class="{'is-loading': loading}" @click="submit">
				Save
			</button>
		</template>
	</Profile>
</template>

<script>
	import globe from '../../../assets/images/globe-icon.png';
	import Profile from "@/Components/Dashboard/Profile";
	import MultiFileField from "@/Components/Modals/CreateMarker/MultiFileField";

	export default {
		name: "ProfileEdit",
		components: {Profile, MultiFileField},

		data() {
			return {
				description: '',
				loading: false,
				file: {},
			}
		},

		methods: {
			async submit() {
				this.loading = true;
				const formData = new FormData();
				formData.append('description', this.description);
				if (Object.values(this.file)[0]) {
					const file = Object.values(this.file)[0];
					formData.append('image', file.asBlob(), file.name);
				}
				const response = await this.$http.post(`bio`, formData);
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
					this.file = {};
				} else {
					this.$toast.error('Please try again at a later time', 'Update failed.');
				}
				this.loading = false;
			},
		},
		computed: {
			user() {
				this.description = this.$store.state.Profile.user.description;
				return this.$store.state.Profile.user;
			},

			imageSrc() {
				return this.user.path ? `/api${this.user.path}` : globe;
			}
		}
	}
</script>

<template>
	<BaseModal @update:active="$emit('update:active',$event)" :active="active">
		<template #header>
			<p class="card__header-title">Choose story name</p>
		</template>
		<template #content>
			<TextField label="Story name" v-model="name"
					   :error="errors.name || ''"/>
			<template v-if="canEdit">
				<SelectField label="Published" v-model="published" :options="{
						0: 'No',
						1: 'Yes'
					}"/>
			</template>
		</template>
		<template #footer>
			<p class="card__footer-item">
				<button v-if="canEdit" class="button is-danger-background is-fullwidth"
						:class="{'is-loading': deleting}" @click="deleteStory">
					Delete
				</button>
				<span v-else>
					<a @click="$emit('update:active',false)">Cancel</a>
				</span>
			</p>
			<p class="card__footer-item">
				<button class="button is-primary-background is-fullwidth" @click="saveStory"
						:class="{'is-loading': saving}">
					Save
				</button>
			</p>
		</template>
	</BaseModal>
</template>

<script>
	import BaseModal from "@/Components/Utilities/BaseModal";
	import TextField from "@/Components/Modals/CreateMarker/TextField";
	import SelectField from "@/Components/Modals/CreateMarker/SelectField";

	export default {
		name: "StoryEditModal",
		components: {SelectField, TextField, BaseModal},

		props: {
			active: {
				type: Boolean,
				default: false
			},
			story: {
				type: Object,
				default() {
					return {};
				}
			}
		},

		data() {
			return {
				name: this.story.name || '',
				published: this.story.published || 0,
				saving: false,
				errors: {},
				deleting: false,
			}
		},

		computed: {
			canEdit() {
				const user = this.$store.state.User.user;
				return this.$store.state.Stories.story && user && this.$store.state.Stories.story.user_id === user.id;
			}
		},

		methods: {
			async deleteStory() {
				this.deleting = true;
				const success = await this.$store.dispatch('Stories/delete');
				this.deleting = false;

				if (!success) {
					this.$toast.error('Please try again at a later time', 'Delete failed.');
					return;
				}

				this.$toast.success(' ', 'Story deleted.');
				this.$store.commit('Stories/exit');
				this.$router.push(`/${this.$route.params.username}`);
			},


			async saveStory() {
				this.saving = true;
				this.error = '';
				const {status, id} = await this.$store.dispatch('Stories/save', {
					name: this.name,
					published: this.published
				});

				this.saving = false;


				if (status === 422) {
					return this.error = 'The story most have a name';
				}
				if (status < 200 || status > 299) {
					this.$toast.error('Please try again at a later time', 'Saving failed.');
					return;
				}

				this.$emit('saved', id);
			}
		}

	}
</script>

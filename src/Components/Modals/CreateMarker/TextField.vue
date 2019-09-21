<template>
	<div class="field">
		<label class="label" v-if="label" :for="inputId" v-text="label"/>
		<div class="control">
			<input :type="type" :id="inputId" class="input" v-model.lazy="val" :placeholder="placeholder"
				   :name="name">
			<p class="help is-danger" v-if="error" v-text="error"/>
		</div>
	</div>
</template>

<script>
	import FieldMixin from "@/Components/Utilities/FieldMixin";

	export default {
		name: "TextField",
		mixins: [FieldMixin],

		props: {
			type: {
				type: String,
				default: 'text'
			},
		},
	}
</script>

<template>
	<div class="field">
		<label :for="inputId" class="label" v-text="label" v-if="label"/>
		<div class="select">
			<select :id="inputId" :name="name" v-model="val">
				<option v-for="(option, key) in options" :value="key"
						v-text="option"/>
			</select>
		</div>
		<p class="help is-danger" v-if="error" v-text="error"/>
	</div>
</template>

<script>
	import FieldMixin from "@/Components/Utilities/FieldMixin";

	export default {
		name: "SelectField",
		mixins: [FieldMixin],
        compatConfig: { COMPONENT_V_MODEL: false },

		props: {
			options: {
				type: Object,
				required: true
			},
		},
	}
</script>

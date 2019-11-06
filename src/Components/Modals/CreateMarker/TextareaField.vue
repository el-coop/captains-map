<template>
	<div class="field">
		<label class="label" v-if="label" :for="inputId" v-text="label"/>
		<textarea :id="inputId" class="textarea" v-model.lazy="val" :placeholder="placeholder"
				  :name="name"/>
		<p class="help is-danger" v-if="error" v-text="error"/>
	</div>
</template>

<script>
	import FieldMixin from "@/Components/Utilities/FieldMixin";

	export default {
		name: "TextareaField",
		mixins: [FieldMixin],
	}
</script>

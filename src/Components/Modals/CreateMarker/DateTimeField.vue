<template>
	<div class="field">
		<label class="label" v-text="label" v-if="label"/>
		<div class="field is-grouped">
			<input type="date" class="input" v-model.lazy="date"/>
			<input type="time" class="input" v-model.lazy="time"/>
		</div>
		<p class="help is-danger" v-if="error" v-text="error"/>
	</div>
</template>

<script>
	export default {
        name: "DateTimeField",
        emits: ['update:modelValue'],

		props: {
            modelValue: {
				default() {
					return null;
				}
			},
			error: {
				type: String,
				default: ''
			},
			label: {
				type: String,
				default: ''
			}
		},

		methods: {
			getDateTime() {
				return new Date(`${this.date}T${this.time}Z`);
			},

			formatDate(date) {
				date = new Date(date);

				let day = date.getDate();
				if (day < 10) {
					day = `0${day}`;
				}

				let month = date.getMonth() + 1;
				if (month < 10) {
					month = `0${month}`;
				}


				return `${date.getFullYear()}-${month}-${day}`;
			},

			formatTime(date) {
				date = new Date(date);

				let hour = date.getHours();
				if (hour < 10) {
					hour = `0${hour}`;
				}

				let minutes = date.getMinutes();
				if (minutes < 10) {
					minutes = `0${minutes}`;
				}

				return `${hour}:${minutes}`;
			}
		},

		data() {
			return {
				date: this.formatDate(this.modelValue),
				time: this.formatTime(this.modelValue),
			}
		},

		watch: {
			date: {
				immediate: true,
				handler(value) {
					this.$emit('update:modelValue', this.getDateTime());
				}
			},
			time(value) {
				this.$emit('update:modelValue', this.getDateTime());
			},
		},

	}
</script>

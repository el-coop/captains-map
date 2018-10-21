<template>
	<div class="field">
		<label class="label">Time</label>
		<div class="field is-grouped">
			<div class="control is-expanded">
				<input type="date" class="input" v-model="date"/>
			</div>
			<div class="control is-expanded">
				<input type="time" class="input" v-model="time"/>
			</div>
		</div>
		<p class="help is-danger" v-if="error">Invalid date or time.</p>
	</div>
</template>

<script>
	export default {
		name: "create-marker-date-time-field",

		props: {
			value: {
				default() {
					return null;
				}
			},
			error: {
				type: String,
				default: ''
			}
		},

		methods: {
			getDateTime() {
				return new Date(`${this.date} ${this.time}`);
			},

			getCurrentDate() {
				const date = new Date();

				return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
			},

			getCurrentTime() {
				const date = new Date();

				let hour = date.getHours();
				if (hour < 10) {
					hour = `0${hour}`;
				}

				return `${hour}:${date.getMinutes()}`;
			}
		},

		data() {
			return {
				date: this.getCurrentDate(),
				time: this.getCurrentTime(),
			}
		},

		watch: {
			date(value) {
				this.$emit('input', this.getDateTime());
			},
			time(value) {
				this.$emit('input', this.getDateTime());
			},
		},

	}
</script>

<style scoped>

</style>
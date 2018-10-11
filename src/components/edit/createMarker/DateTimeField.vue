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
			}
		},

		data() {
			return {
				date: this.$moment().format('YYYY-MM-DD'),
				time: this.$moment().format('HH:mm'),
			}
		},

		watch: {
			date(value) {
				console.log(this.getDateTime());
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
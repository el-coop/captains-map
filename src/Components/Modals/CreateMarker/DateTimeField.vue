<template>
	<div class="field">
		<label class="label" v-text="label" v-if="label"/>
		<div class="field is-grouped">
			<div class="control is-expanded">
				<input type="date" class="input" v-model="date"/>
			</div>
			<div class="control is-expanded">
				<input type="time" class="input" v-model="time"/>
			</div>
		</div>
		<p class="help is-danger" v-if="error" v-text="error"/>
	</div>
</template>

<script>
	export default {
		name: "DateTimeField",

		props: {
			value: {
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
				return new Date(`${this.date} ${this.time}`);
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
				date: this.formatDate(this.value),
				time: this.formatTime(this.value),
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

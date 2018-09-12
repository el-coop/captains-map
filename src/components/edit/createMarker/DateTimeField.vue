<template>
	<div class="field">
		<label class="label">Time</label>
		<div class="field is-grouped">
			<div class="control is-expanded">
				<datapicker v-model="date" icon-pack="fa"/>
			</div>
			<div class="control is-expanded">
				<timepicker v-model="time"/>
			</div>
		</div>
		<p class="help is-danger" v-if="error">Invalid date or time.</p>
	</div>
</template>

<script>
	import Moment from 'moment';
	import Datapicker from 'buefy/src/components/datepicker';
	import Timepicker from 'buefy/src/components/timepicker';

	export default {
		name: "create-marker-date-time-field",

		components: {
			Datapicker,
			Timepicker
		},

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
				return new Date(`${Moment(this.date).format('MM/DD/YYYY')} ${Moment(this.time).format('HH:mm')}`);
			}
		},

		data() {
			return {
				date: new Date(),
				time: new Date()
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
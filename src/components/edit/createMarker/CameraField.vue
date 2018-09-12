<template>
	<div class="content">
		<div class="camera-wrapper">
			<canvas ref="canvas" class="canvas is-hidden"/>
			<img :src="value" v-show="value">
			<div v-show="cameraAllowed">
				<video ref="video" class="camera-stream" v-show="!value"/>
			</div>
			<button type="button" class="button is-large is-dark" @click="capture" v-show="cameraAllowed || value">
				<font-awesome-icon icon="camera"/>
			</button>
		</div>
		<h4 class="is-4 title has has-text-centered" v-if="! cameraAllowed && ! value">Please allow access to your
			camera</h4>
		<p class="help is-danger" v-if="error" v-text="error"></p>
	</div>
</template>

<script>
	export default {
		name: "CreateMarkerCamView",

		props: {
			value: {
				default: null,
			},
			error: {
				type: String,
				default: ''
			}
		},

		data() {
			return {
				cameraAllowed: false,
			}
		},

		async mounted() {
			try {
				this.$refs.video.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
				this.cameraAllowed = true;
				this.$refs.video.play();
			} catch (error) {
				this.$toast.error("Can't access camera.");
			}
		},

		methods: {
			capture() {
				if (this.value) {
					this.$emit('input', '');
					return;
				}
				const canvas = this.$refs.canvas;
				const context = canvas.getContext('2d');
				canvas.width = this.$refs.video.clientWidth;
				canvas.height = this.$refs.video.clientHeight;
				context.drawImage(this.$refs.video, 0, 0, this.$refs.video.clientWidth, this.$refs.video.clientHeight);

				this.$emit('input', canvas.toDataURL('image/png'));
			}
		}
	}
</script>

<style lang="scss" scoped>
	.camera-wrapper {

		position: relative;

		> .camera-stream, .canvas {
			width: 100%;
			max-height: 100%;
		}

		> .button {
			position: absolute;
			bottom: 15px;
			right: 10px;
		}
	}
</style>
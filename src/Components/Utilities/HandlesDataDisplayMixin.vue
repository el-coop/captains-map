<script>
	export default {
		methods: {
			calculateUnverifiedImage(src) {
				if (src['media[type]'] === 'instagram') {
					const regex = new RegExp(/https:\/\/www\.instagram\.com\/p\/(\w*)\/.*/i);
					const path = regex.exec(src['media[path]']);
					if (path) {
						return `https://instagram.com/p/${path[1]}/media/`;
					} else {
						return '';
					}
				}
				return 'data:image/jpeg;base64,' + btoa(src['media[image]']);
			},

			calculateVerifiedImage(src) {
				if (src.media.type === 'instagram') {
					return `https://instagram.com/p/${src.media.path}/media/`;
				} else {
					return `/api${src.media.path.replace('images', 'thumbnails')}`;
				}
			},

			dateDisplay(value) {
				const date = new Date(value);

				let hour = date.getUTCHours();
				if (hour < 10) {
					hour = `0${hour}`;
				}

				return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()} ${hour}:${date.getUTCMinutes()}`;
			}
		},

		filters: {
			truncate(text, length) {
				let hasEnters = false;
				if (text.indexOf('\n') > 0) {
					text = text.substring(0, text.indexOf('\n'));
					hasEnters = true;
				}
				if (text.length <= length - 4) {
					return text + (hasEnters ? ' ...' : '');
				}
				let tcText = text.slice(0, length - 3);
				let last = tcText.length;


				while (last > 0 && tcText[last] !== ' ' && tcText[last] !== '.') {
					last--;
				}

				last = last || length - 3;

				tcText = tcText.slice(0, last);

				return tcText + '...';
			},
		}
	}
</script>

<script>

	function zeroFormat(value) {
		if (value < 10) {
			return `0${value}`;
		}

		return value;
	}

	export default {
		methods: {
			calculateUnverifiedImage(src) {
				if (src.media.type === 'instagram') {

					const regex = new RegExp(/https:\/\/www\.instagram\.com\/(p|reel)\/(\w*)\/.*/i);
					const path = regex.exec(src.media.path);
					if (path) {
					    //TODO: Fix uploaded images
                        return `/api/marker/instagram/${path[1]}/${path[2]}`;
					} else {
						return '';
					}
				}
				if (!Object.values(src.media.files).length) {
					return '';
				}
				return Object.values(src.media.files)[0].preview;
			},

			calculateVerifiedImage(src) {
				if (src.type === 'instagram') {
				    const instagram_type = src.instagram_type || 'p';
					return `/api/marker/instagram/${instagram_type}/${src.path}`;
				} else {
					return `/api${src.path.replace('images', 'thumbnails')}`;
				}
			},

			dateDisplay(value) {
				const date = new Date(value);

				return `${zeroFormat(date.getUTCDate())}/${zeroFormat(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} ${zeroFormat(date.getUTCHours())}:${zeroFormat(date.getUTCMinutes())}`;
			},
            
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
            
            textAfterLine(text) {
                const splitText = text.split('-');
                if (splitText.length > 1) {
                    text = splitText[1];
                }
                
                return text.trim();
            }
		},
    }
</script>

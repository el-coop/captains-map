class ImageService {
	static stringToBlob(imageString) {
		const byteCharacters = imageString;
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += 512) {
			const slice = byteCharacters.slice(offset, offset + 512);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		return new Blob(byteArrays, {
			type: 'image/jpeg'
		});
	}

	static imageToBlob(image) {
		if (typeof FileReader === "undefined") {
			return image;
		}
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.addEventListener('abort', (error) => {
				reject(error);
			});
			reader.addEventListener('error', (error) => {
				reject(error);
			});
			reader.addEventListener('loadend', (event) => {
				resolve(reader.result);
			});
			reader.readAsBinaryString(image);
		});
	};
}

export default ImageService;

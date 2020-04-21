function findEXIFinJPEG(image) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('abort', (error) => {
			reject(error);
		});
		reader.addEventListener('error', (error) => {
			reject(error);
		});
		reader.addEventListener('loadend', async (event) => {
			const view = new DataView(reader.result);
			if (view.getUint16(0, false) !== 0xFFD8) {
				return resolve(-1);
			}
			const length = view.byteLength;
			let offset = 2;
			while (offset < length) {
				const marker = view.getUint16(offset, false);
				offset += 2;
				if (marker === 0xFFE1) {
					if (view.getUint32(offset += 2, false) !== 0x45786966) {
						return resolve(-1);
					}
					const little = view.getUint16(offset += 6, false) === 0x4949;
					offset += view.getUint32(offset + 4, little);
					const tags = view.getUint16(offset, little);
					offset += 2;
					for (let i = 0; i < tags; i++)
						if (view.getUint16(offset + (i * 12), little) === 0x0112) {
							return resolve(view.getUint16(offset + (i * 12) + 8, little));
						}
				} else if ((marker & 0xFF00) !== 0xFF00) {
					return resolve(-1);
				} else {
					offset += view.getUint16(offset, false);
				}
			}
			return resolve(-1);
		});
		reader.readAsArrayBuffer(image);
	});
}

function imageToDataUrl(image) {
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
		reader.readAsDataURL(image);
	});
}

function imageToBlob(image) {

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
}

function imageToCanvas(src, orientation) {

	const image = new Image();
	return new Promise((resolve, reject) => {
		image.addEventListener('load', () => {
			let width = image.width;
			let height = image.height;
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext("2d");

			if (4 < orientation && orientation < 9) {
				canvas.width = height;
				canvas.height = width;
			} else {
				canvas.width = width;
				canvas.height = height;
			}

			switch (orientation) {
				case 2: {
					ctx.transform(-1, 0, 0, 1, width, 0);
					break;
				}
				case 3: {
					ctx.transform(-1, 0, 0, -1, width, height);
					break;
				}
				case 4: {
					ctx.transform(1, 0, 0, -1, 0, height);
					break;
				}
				case 5: {
					ctx.transform(0, 1, 1, 0, 0, 0);
					break;
				}
				case 6: {
					ctx.transform(0, 1, -1, 0, height, 0);
					break;
				}
				case 7: {
					ctx.transform(0, -1, -1, 0, height, width);
					break;
				}
				case 8: {
					ctx.transform(0, -1, 1, 0, 0, width);
					break;
				}
			}

			// draw image
			ctx.drawImage(image, 0, 0);
			canvas.toBlob((blob) => {
				resolve(blob);
			}, 'image/jpeg');
		});

		image.src = src;
	});

}

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

	static async imageToBlob(image) {
		if (typeof FileReader === "undefined") {
			return image;
		}
		const orientation = await findEXIFinJPEG(image);

		if(orientation < 2){
			return await imageToBlob(image);
		}

		const src = await imageToDataUrl(image);
		const blob = await imageToCanvas(src, orientation);

		return await imageToBlob(blob);
	};
}

export default ImageService;

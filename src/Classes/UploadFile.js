import ImageService from "@/Services/ImageService";

class UploadFile {
	static async makeFromFile(file) {
		const image = await ImageService.imageToBlob(file);
		return new UploadFile(file.name, image);
	}

	constructor(name, image) {
		this.name = name;
		this.image = image;
	}

	asBlob(){
		return ImageService.stringToBlob(this.image);
	}

	get preview() {
		return 'data:image/jpeg;base64,' + btoa(this.image);
	}

	async rotatedImage(degrees = 0) {
		if(! degrees){
			return this.preview;
		}
		const blob = await ImageService.rotate(this.image, degrees);
		return  'data:image/jpeg;base64,' + btoa(blob);
	}

}

export default UploadFile;


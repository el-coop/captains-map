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

	get preview() {
		return 'data:image/jpeg;base64,' + btoa(this.image);
	}

}

export default UploadFile;


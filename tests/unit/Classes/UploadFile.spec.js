import sinon from 'sinon';
import { assert } from 'chai';
import UploadFile from "@/Classes/UploadFile";
import ImageService from "@/Services/ImageService";

describe('UploadFile', () => {

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
	});

	it('Creates a new upload file', () => {
		const file = new UploadFile('name','image');

		assert.equal(file.name,'name');
		assert.equal(file.image,'image');
	});

	it('Has a preview property', () => {
		const file = new UploadFile('name','image');

		assert.equal(file.preview,'data:image/jpeg;base64,' + btoa('image'));
	});

	it('Creates upload file reading from file', async () => {
		sinon.stub(ImageService,'imageToBlob').returns('processedImaged');

		const file = await UploadFile.makeFromFile({name: 'file', image: 'image'});

		assert.equal(file.name,'file');
		assert.equal(file.image,'processedImaged');
	});
});

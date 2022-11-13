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

	it('Rotates image', async () => {
		sinon.stub(ImageService,'imageToBlob').returns('processedImaged');
		const rotateStub = sinon.stub(ImageService,'rotate').returns('rotatedImage');

		const file = await UploadFile.makeFromFile({name: 'file', image: 'image'});

		await file.rotate(90);

		assert.equal(file.image,'rotatedImage');
	});

	it('Rotated preview returns normal preview when called with 0 degrees', async () => {
		const rotateStub = sinon.stub(ImageService,'rotate');

		const file = new UploadFile('name','image');

		const result = await file.rotatedPreview(0);

		assert.isTrue(rotateStub.notCalled)

		assert.equal(result,'data:image/jpeg;base64,' + btoa('image'));
	});

	it('Rotated preview returns rotated when called with more degrees than 0', async () => {
		const rotateStub = sinon.stub(ImageService,'rotate').returns('rotatedImage');

		const file = new UploadFile('name','image');

		const result = await file.rotatedPreview(90);

		assert.equal(result,'data:image/jpeg;base64,' + btoa('rotatedImage'));
	});
});

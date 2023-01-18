import {describe, it, expect, afterEach} from 'vitest';
import sinon from 'sinon';
import UploadFile from "@/Classes/UploadFile";
import ImageService from "@/Services/ImageService";

describe('UploadFile', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Creates a new upload file', () => {
		const file = new UploadFile('name', 'image');

		expect(file.name).toBe('name');
		expect(file.image).toBe('image');
	});

	it('Has a preview property', () => {
		const file = new UploadFile('name', 'image');

		expect(file.preview).toBe('data:image/jpeg;base64,' + btoa('image'));
	});

	it('Creates upload file reading from file', async () => {
		sinon.stub(ImageService, 'imageToBlob').returns('processedImaged');

		const file = await UploadFile.makeFromFile({name: 'file', image: 'image'});

		expect(file.name, 'file').toBe('file');
		expect(file.image, 'processedImaged').toBe('processedImaged');
	});

	it('Rotates image', async () => {
		sinon.stub(ImageService, 'imageToBlob').returns('processedImaged');
		const rotateStub = sinon.stub(ImageService, 'rotate').returns('rotatedImage');

		const file = await UploadFile.makeFromFile({name: 'file', image: 'image'});

		await file.rotate(90);

		expect(file.image).toBe('rotatedImage');
	});

	it('Rotated preview returns normal preview when called with 0 degrees', async () => {
		const rotateStub = sinon.stub(ImageService, 'rotate');

		const file = new UploadFile('name', 'image');

		const result = await file.rotatedPreview(0);

		expect(rotateStub.notCalled).toBeTruthy();

		expect(result).toBe('data:image/jpeg;base64,' + btoa('image'));
	});

	it('Rotated preview returns rotated when called with more degrees than 0', async () => {
		const rotateStub = sinon.stub(ImageService, 'rotate').returns('rotatedImage');

		const file = new UploadFile('name', 'image');

		const result = await file.rotatedPreview(90);

		expect(rotateStub.calledOnce).toBeTruthy();
		expect(rotateStub.calledWith('image', 90)).toBeTruthy();

		expect(result).toBe('data:image/jpeg;base64,' + btoa('rotatedImage'));
	});
});

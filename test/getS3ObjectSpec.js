/*global describe, it, beforeEach*/

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import {getS3Object} from '../src/index'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('getS3Object', () => {
	let provider, bucket, key;
	beforeEach(() => {
		provider = {
			getObject: (getParams, cb) => cb(getParams)
		};
		bucket = 'test bucket';
		key = 'test key';
	});
	it('exits', () => {
		expect(getS3Object).to.be.a('function');
	});
	it('throws provider missing getObject', () => {
		expect(() => getS3Object({})).to.throw('provider.getObject(params, function(err, data)) is missing');
	});
	it('throws bucket is missing', () => {
		expect(() => getS3Object({provider})).to.throw('bucket parameter is missing');
	});
	it('throws key is missing', () => {
		expect(() => getS3Object({provider, bucket})).to.throw('key parameter is missing');
	});
	it('calls provider.getObject() with correct parameters', () => {
		provider.getObject = sinon.spy();
		getS3Object({provider, bucket, key});
		expect(provider.getObject).to.be.calledWith({Bucket: bucket, Key: key});
	});
	it('provider.getObject(params, callback) on success', () => {
		const callback = sinon.spy();
		provider.getObject = (params, cb) => {
			cb(null, {test: 'test event callback'});
		};
		return getS3Object({provider, bucket, key}).then((result) => {
			expect(result).to.eql({bucket, key, response: {test: 'test event callback'}});
		});
	});
	it('provider.getObject(params, callback) on failure', () => {
		const callback = sinon.spy();
		provider.getObject = (params, cb) => {
			cb({test: 'test event callback error'});
		};
		return getS3Object({provider, bucket, key}).catch((result) => {
			expect(result).to.eql({test: 'test event callback error'});
		});
	});
});

/*global describe, it, beforeEach*/

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import {getS3ObjectsAsJson} from '../src/index'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('getS3ObjectsAsJson', () => {
	let provider, bucket, keys, s3event;
	beforeEach(() => {
		s3event = {
			object: {
				Body: {
					toString() {
						return JSON.stringify({test: 'test s3 event object body string'});
					}
				}
			}
		};
		provider = {
			getObject: (getParams, cb) => cb(null, s3event)
		};
		bucket = 'test bucket';
		keys = ['test key'];
	});
	it('exits', () => {
		expect(getS3ObjectsAsJson).to.be.a('function');
	});
	it('throws key is missing', () => {
		expect(() => getS3ObjectsAsJson({})).to.throw('keys parameter is missing');
	});
	it('throws provider missing getObject', () => {
		expect(() => getS3ObjectsAsJson({keys})).to.throw('provider.getObject(params, function(err, data)) is missing');
	});
	it('throws bucket is missing', () => {
		expect(() => getS3ObjectsAsJson({keys, provider})).to.throw('bucket parameter is missing');
	});
	it('throws key is missing', () => {
		expect(() => getS3ObjectsAsJson({keys: [null], provider, bucket})).to.throw('key parameter is missing');
	});
	it('calls provider.getObject() with correct parameters', () => {
		provider.getObject = sinon.spy();
		getS3ObjectsAsJson({provider, bucket, keys});
		expect(provider.getObject).to.be.calledWith({Bucket: bucket, Key: keys[0]});
	});
	it('provider.getObject(params, callback) on success', () => {
		return getS3ObjectsAsJson({provider, bucket, keys}).then((result) => {
			expect(result).to.eql([{test: 'test s3 event object body string'}]);
		});
	});
	it('provider.getObject(params, callback) on failure', () => {
		provider.getObject = (params, cb) => {
			cb({test: 'test event callback error'});
		};
		return getS3ObjectsAsJson({provider, bucket, keys}).then((result) => {
			expect(result).to.eql([{}]);
		});
	});
});

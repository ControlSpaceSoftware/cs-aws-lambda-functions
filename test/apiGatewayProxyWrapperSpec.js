/*global describe, it, beforeEach*/

import chai from 'chai'
import {apiGatewayProxyWrapper} from '../src'

const expect = chai.expect;

describe('apiGatewayProxyWrapper', () => {
	let params, apiProxy, bodyHandler;
	beforeEach(() => {
		bodyHandler = (params) => new Promise((resolve, reject) => {
			resolve(params);
		});
		params = {
			test: 'test body data'
		};
		apiProxy = {
			event: {
				body: JSON.stringify(params)
			},
			context: {
				apiGatewayProxyWrapper: 'test proxy context'
			}
		};
	});
	it('exits', () => {
		expect(apiGatewayProxyWrapper).to.be.a('function');
	});
	it('returns function when required params give', () => {
		expect(apiGatewayProxyWrapper.bind(null, bodyHandler)).to.be.a('function');
	});
	it('calls bodyHandler(params) with event.body correctly', () => {
		const bodyHandler = (params) => {
			expect(params).to.eql({test: 'test body data'});
			return new Promise((resolve) => {
				resolve();
			});
		};
		const wrapper = apiGatewayProxyWrapper(bodyHandler);
		wrapper(apiProxy.event, apiProxy.context, () => {});
	});
	it('bodyHandler(params).then(...) calls callback(err, body) correctly', () => {
		bodyHandler = (params) => {
			return new Promise((resolve) => {
				resolve({test: 'test resolve'});
			});
		};
		const expected = {"statusCode":"200","body":"{\"test\":\"test resolve\"}","headers":{"Content-Type":"application/json"}};
		const wrapper = apiGatewayProxyWrapper(bodyHandler);
		wrapper(apiProxy.event, apiProxy.context, (err, data) => {
			expect(data).to.eql(expected);
		});
	});
});

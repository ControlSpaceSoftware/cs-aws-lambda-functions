/*global describe, it, beforeEach*/

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import {apiGatewayProxyWrapper} from '../src'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('apiGatewayProxyWrapper', () => {
	let userInput, apiProxy, bodyHandler;
	beforeEach(() => {
		bodyHandler = (params) => new Promise((resolve, reject) => {
			resolve(params);
		});
		userInput = {
			test: 'test user input'
		};
		apiProxy = {
			event: {
				body: JSON.stringify(userInput)
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
		const bodyHandler = (userInput) => {
			expect(userInput).to.eql({test: 'test user input'});
			return new Promise((resolve) => {
				resolve();
			});
		};
		const wrapper = apiGatewayProxyWrapper(bodyHandler);
		wrapper(apiProxy.event, apiProxy.context, () => {});
	});
	xit('bodyHandler(params) calls callback(err, body) correctly on success', () => {
		bodyHandler = (userInput) => {
			return new Promise((resolve) => {
				resolve({test: 'test resolve'});
			});
		};
		const expected = {"statusCode":"200","body":"{\"test\":\"test resolve\"}","headers":{"Content-Type":"application/json"}};
		const wrapper = apiGatewayProxyWrapper(bodyHandler);
		const callback = (err, data) => expect(data).to.eql(expected);
		wrapper(apiProxy.event, apiProxy.context, callback);
	});
	xit('bodyHandler(params) calls callback(err, body) correctly on failure', () => {
		bodyHandler = (userInput) => {
			console.log('1 userInput', userInput);
			return new Promise((resolve, reject) => {
				console.log('2 promise called');
				console.log('3 calling reject');
				reject({test: 'test reject'});
			});
		};
		const expected = {test: 'test reject'};
		const wrapper = apiGatewayProxyWrapper(bodyHandler);
		const callback = sinon.spy();
		wrapper(apiProxy.event, apiProxy.context, callback);
		console.log('spy', JSON.stringify(callback.args, null, 4));
		expect(callback).to.have.been.called();
	});
});

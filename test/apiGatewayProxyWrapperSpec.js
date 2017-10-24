/*global describe, it, beforeEach*/

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import {apiGatewayProxyWrapper} from '../src'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('apiGatewayProxyWrapper', () => {
	let userInput, event, context, bodyHandler;
	beforeEach(() => {
		userInput = {
			test: 'test user input'
		};
		bodyHandler = (userInput, event, context) => new Promise((resolve, reject) => {
			resolve({userInput, event, context});
		});
		event = {
			body: JSON.stringify(userInput),
			requestContext: {
				requestId: 'test request id'
			}
		};
		context = {
			test: 'test context'
		};
	});
	it('exits', () => {
		expect(apiGatewayProxyWrapper).to.be.a('function');
	});
	it('returns function when required params give', () => {
		expect(apiGatewayProxyWrapper.bind(null, bodyHandler)).to.be.a('function');
	});
	it('calls bodyHandler(userInput, event, context) with event.body correctly', () => {
		const bodyHandler = sinon.stub().returns(Promise.resolve());
		const wrapper = apiGatewayProxyWrapper(bodyHandler);
		wrapper(event, context, () => {
		});
		expect(bodyHandler).to.have.been.calledWith(userInput, event, context);
	});
	it('bodyHandler(userInput, event, context) calls callback(error, response) correctly on success', () => {
		bodyHandler = () => {
			return new Promise((resolve) => {
				resolve({test: 'test resolve'});
			});
		};
		const expected = {
			statusCode: '200',
			body: '{"test":"test resolve"}',
			headers: {"Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json'}
		};
		const wrapper = apiGatewayProxyWrapper(bodyHandler);
		const callback = sinon.stub().returns(Promise.resolve());
		return wrapper(event, context, callback).then(() => {
			expect(callback).to.have.been.calledWith(null, expected);
		});
	});
	it('bodyHandler(params) calls callback(err, body) correctly on failure', () => {
		bodyHandler = () => {
			return new Promise((resolve, reject) => {
				reject({test: 'test reject'});
			});
		};
		const expected = {
			statusCode: '400',
			body: '{"test":"test reject","requestId":"test request id"}',
			headers: {"Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json'}
		};
		const wrapper = apiGatewayProxyWrapper(bodyHandler);
		const callback = sinon.spy();
		return wrapper(event, context, callback).then(() => {
			expect(callback).to.have.been.calledWith(null, expected);
		});
	});
});

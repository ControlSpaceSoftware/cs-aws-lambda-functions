/*global describe, it, beforeEach*/

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import {apiGatewayProxyHandlerFactory} from '../src'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('apiGatewayProxyHandlerFactory', () => {
	let userInput, event, context, eventHandler;
	beforeEach(() => {
		userInput = {
			test: 'test user input'
		};
		eventHandler = (event, context) => new Promise((resolve, reject) => {
			resolve({event, context});
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
		expect(apiGatewayProxyHandlerFactory).to.be.a('function');
	});
	it('returns function when required params give', () => {
		expect(apiGatewayProxyHandlerFactory.bind(null, {eventHandler})).to.be.a('function');
	});
	it('calls eventHandler(event, context) with event and context', () => {
		const eventHandler = sinon.stub().returns(Promise.resolve());
		const proxyHandler = apiGatewayProxyHandlerFactory({eventHandler});
		proxyHandler(event, context, () => {});
		expect(eventHandler).to.have.been.calledWith(event, context);
	});
	it('eventHandler(event, context) calls callback(error, response) correctly on success', () => {
		eventHandler = () => {
			return new Promise((resolve) => {
				resolve({test: 'test resolve'});
			});
		};
		const expected = {
			statusCode: '200',
			body: '{"test":"test resolve"}',
			headers: {"Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json'}
		};
		const proxyHandler = apiGatewayProxyHandlerFactory({eventHandler});
		const callback = sinon.spy();
		return proxyHandler(event, context, callback).then(() => {
			expect(callback).to.have.been.calledWith(null, expected);
		});
	});
	it('eventHandler(event, context) calls callback(error, result) correctly on failure', () => {
		eventHandler = () => {
			return new Promise((resolve, reject) => {
				reject({test: 'test reject'});
			});
		};
		const expected = {
			statusCode: '400',
			body: '{"test":"test reject"}',
			headers: {"Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json'}
		};
		const proxyHandler = apiGatewayProxyHandlerFactory({eventHandler});
		const callback = sinon.spy();
		return proxyHandler(event, context, callback).then(() => {
			expect(callback).to.have.been.calledWith(null, expected);
		});
	});
});

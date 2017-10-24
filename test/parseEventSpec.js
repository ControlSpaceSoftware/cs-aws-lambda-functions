/*global describe, it, beforeEach*/

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import {parseEvent, parseEventBody, parseEventParams, parseEventUserInfo} from '../src/index'
import getEvent from './event-get-authorized-ok.json'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('parseEvent', () => {
	let event;
	beforeEach(() => {
		event = getEvent;
	});
	it('exits', () => {
		expect(parseEvent).to.be.a('function');
	});
	it('parses event.body', () => {
		const result = parseEvent(event);
		expect(result).to.eql({
			"body": null,
			"pathParams": {},
			"stageParams": {},
			"queryParams": {"s": "foo"},
			"requestParams": {
				"accountId": "test",
				"apiId": "test",
				"httpMethod": "GET",
				"path": "/dev/search",
				"requestId": "4d75990d-89f3-11e7-98b2-61f25e17ca2a",
				"resourceId": "test",
				"resourcePath": "/search",
				"stage": "dev"
			},
			"userInfo": {
				"sub": "b0e7da81-3271-46dc-b8b0-7d62cef3ab31",
				"aud": "test",
				"email_verified": "true",
				"token_use": "id",
				"auth_time": "1503706034",
				"iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-test",
				"cognito:username": "test+username.com",
				"exp": "Sat Aug 26 01:07:14 UTC 2017",
				"iat": "Sat Aug 26 00:07:14 UTC 2017",
				"email": "test@username.com"
			}
		});
	});
	it('ignores non string values', () => {
		const event = {};
		const result = parseEvent(event);
		expect(result).to.eql({
			"pathParams": {},
			"stageParams": {},
			"queryParams": {},
			"userInfo": undefined,
			body: undefined,
			requestParams: {}
		});
	});
});

describe('parseEventUserInfo', () => {
	let event;
	beforeEach(() => {
		event = {
			'requestContext': {
				'authorizer': {
					'claims': {
						'test': 'test user info'
					}
				}
			}
		};
	});
	it('exits', () => {
		expect(parseEventUserInfo).to.be.a('function');
	});
	it('parses event.body', () => {
		expect(parseEventUserInfo(event)).to.eql({userInfo: {test: 'test user info'}});
	});
	it('ignores non string values', () => {
		const event = {};
		expect(parseEventUserInfo(event)).to.eql({userInfo: undefined});
	});
});

describe('parseEventParams', () => {
	let event;
	beforeEach(() => {
		event = {
			pathParameters: {test: 'test path parameters'},
			stageVariables: {test: 'test stage variables'},
			queryStringParameters: {test: 'test query string parameters'}
		};
	});
	it('exits', () => {
		expect(parseEventParams).to.be.a('function');
	});
	it('parses event.body', () => {
		expect(parseEventParams(event)).to.eql({
			pathParams: {test: 'test path parameters'},
			stageParams: {test: 'test stage variables'},
			queryParams: {test: 'test query string parameters'},
			requestParams: {}
		});
	});
	it('ignores non string values', () => {
		const event = {};
		expect(parseEventParams(event)).to.eql({
			pathParams: {},
			stageParams: {},
			queryParams: {},
			requestParams: {}
		});
	});
});

describe('parseEventBody', () => {
	let event, body;
	beforeEach(() => {
		body = JSON.stringify({test: 'test body'});
		event = {body};
	});
	it('exits', () => {
		expect(parseEventBody).to.be.a('function');
	});
	it('parses event.body', () => {
		expect(parseEventBody(event).body).to.eql({test: 'test body'});
	});
	it('ignores non string values', () => {
		const event = {body: null};
		expect(parseEventBody(event).body).to.eql(null);
	});
});

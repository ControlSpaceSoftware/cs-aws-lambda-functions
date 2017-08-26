'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = parseEvent;

var _ovObjectPath = require('ov-object-path');

var _ovObjectPath2 = _interopRequireDefault(_ovObjectPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseEvent(event) {

	var pathParams = _ovObjectPath2.default.get(event, 'pathParameters') || {};
	var stageParams = _ovObjectPath2.default.get(event, 'stageVariables') || {};
	var queryParams = _ovObjectPath2.default.get(event, 'queryStringParameters') || {};
	var requestContext = _ovObjectPath2.default.get(event, 'requestContext') || {};

	var requestParams = Object.keys(requestContext).reduce(function (map, key) {
		if (typeof requestContext[key] === 'string') {
			map[key] = requestContext[key];
		}
		return map;
	}, {});

	return { pathParams: pathParams, stageParams: stageParams, queryParams: queryParams, requestParams: requestParams };
}
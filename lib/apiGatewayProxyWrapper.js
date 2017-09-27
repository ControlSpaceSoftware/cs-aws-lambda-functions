'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = apiGatewayProxyWrapper;

var _ovObjectPath = require('ov-object-path');

var _ovObjectPath2 = _interopRequireDefault(_ovObjectPath);

var _parseEventBody = require('./parseEventBody');

var _parseEventBody2 = _interopRequireDefault(_parseEventBody);

var _parseEventParams = require('./parseEventParams');

var _parseEventParams2 = _interopRequireDefault(_parseEventParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @deprecated use {apiGatewayProxyHandlerFactory.js}
 *
 * @param bodyHandler
 * @returns {function(*=, *=, *)}
 */
function apiGatewayProxyWrapper(bodyHandler) {

	return function (event, context, callback) {

		var done = function done(error, response) {

			var statusCode = error ? '400' : '200';

			if (error) {
				// log the full error before trimming for user output
				console.log(JSON.stringify({ event: event, context: context, error: error }, null, 4));
				if ((typeof error === 'undefined' ? 'undefined' : _typeof(error)) === 'object') {
					var params = (0, _parseEventParams2.default)(event);
					error.requestId = params.requestParams.requestId;
					if (params.requestParams.stage === 'prod') {
						// do not publish error info to prod users
						delete error.error;
					}
				}
				response = error;
			}

			var callbackValue = {
				statusCode: statusCode,
				body: JSON.stringify(response),
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			};

			callback(null, callbackValue);
		};

		// NOTE returning a Promise result is for testing harness and has no
		// effect on the lambda function itself

		try {
			var eventBody = (0, _parseEventBody2.default)(event);
			return bodyHandler(eventBody.body, event, context).then(function (result) {
				return done(null, result);
			}).catch(done);
		} catch (error) {
			var requestId = _ovObjectPath2.default.get(event, 'requestContext.requestId');
			console.log(JSON.stringify({ event: event, context: context, error: error }, null, 8));
			done({ code: 'InvalidRequest', message: 'Parse error.', requestId: requestId });
			return Promise.reject(error);
		}
	};
}
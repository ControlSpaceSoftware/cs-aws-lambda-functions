'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = apiGatewayProxyWrapper;

var _ovObjectPath = require('ov-object-path');

var _ovObjectPath2 = _interopRequireDefault(_ovObjectPath);

var _parseEventBody = require('./parseEventBody');

var _parseEventBody2 = _interopRequireDefault(_parseEventBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function apiGatewayProxyWrapper(bodyHandler) {

	return function (event, context, callback) {

		var done = function done(error, response) {

			var statusCode = error ? '400' : '200';

			if (error) {
				console.log(JSON.stringify({ event: event, context: context, error: error }, null, 4));
				response = error;
			}

			var callbackValue = {
				statusCode: statusCode,
				body: JSON.stringify(response),
				headers: {
					'Content-Type': 'application/json'
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
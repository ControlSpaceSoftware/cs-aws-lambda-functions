'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = apiGatewayProxyHandlerFactory;
function apiGatewayProxyHandlerFactory(_ref) {
	var eventHandler = _ref.eventHandler;


	if (typeof eventHandler !== 'function') {
		throw new TypeError('The \'eventHandler\' parameter must be a function.');
	}

	/**
  * AWS Lambda exports.handler function.
  */
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
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			};

			callback(null, callbackValue);
		};

		// NOTE returning a Promise result is for testing
		// and has no effect on the lambda function

		try {

			return eventHandler(event, context).then(function (result) {
				return done(null, result);
			}).catch(function (error) {
				return done(error);
			});
		} catch (error) {
			done({ code: 'InvalidRequest', message: 'Unable to process request.' });
			return Promise.reject(error);
		}
	};
}
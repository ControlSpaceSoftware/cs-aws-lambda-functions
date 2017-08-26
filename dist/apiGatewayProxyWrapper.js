'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = apiGatewayProxyWrapper;
function apiGatewayProxyWrapper(bodyHandler) {

	return function (event, context, callback) {

		var done = function done(error, body) {

			var statusCode = error ? '400' : '200';

			if (error) {
				console.log(JSON.stringify({ event: event, context: context, error: error }, null, 4));
				body = error instanceof Array ? error : [error];
			}

			callback(null, {
				statusCode: statusCode,
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		};

		if (!(event && typeof event.body === 'string')) {
			return done({ code: 'InvalidRequest', message: 'Missing data.' });
		}

		try {
			var userInput = JSON.parse(event.body);
			bodyHandler(userInput, { event: event, context: context }).then(function (result) {
				return done(null, result);
			}).catch(done);
		} catch (error) {
			console.log(JSON.stringify({ event: event, context: context, error: error }, null, 8));
			return done({ code: 'InvalidRequest', message: 'Parse error.' });
		}
	};
}
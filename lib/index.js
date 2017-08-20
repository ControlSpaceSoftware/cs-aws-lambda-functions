'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.apiGatewayProxyWrapper = apiGatewayProxyWrapper;
function apiGatewayProxyWrapper(bodyHandler) {

	return function (event, context, callback) {

		console.log(JSON.stringify({ event: event, context: context }, null, 4));

		var done = function done(err, res) {

			var body = '';

			var statusCode = err ? '400' : '200';

			if (err) {
				body = err instanceof Array ? err : [err];
			} else {
				body = res;
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
			console.log(JSON.stringify({ userInput: userInput }, null, 4));
			bodyHandler(userInput).then(function (result) {
				return done(null, result);
			}).catch(done);
		} catch (error) {
			return done({ code: 'InvalidRequest', message: 'Parse error.' });
		}
	};
}
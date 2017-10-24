export function apiGatewayProxyHandlerFactory({eventHandler}) {

	if (typeof eventHandler !== 'function') {
		throw new TypeError(`The 'eventHandler' parameter must be a function.`);
	}

	/**
	 * AWS Lambda exports.handler function.
	 */
	return (event, context, callback) => {

		const done = (error, response) => {

			const statusCode = error ? '400' : '200';

			if (error) {
				console.log(JSON.stringify({event, context, error}, null, 4));
				response = error;
			}

			const callbackValue = {
				statusCode,
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

			return eventHandler(event, context)
				.then((result) => done(null, result))
				.catch((error) => done(error));

		} catch (error) {
			done({code: 'InvalidRequest', message: 'Unable to process request.'});
			return Promise.reject(error);
		}

	};

}

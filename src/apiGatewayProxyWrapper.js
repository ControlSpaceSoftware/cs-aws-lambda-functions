import path from 'ov-object-path'
import parseEventBody from './parseEventBody'
import parseEventParams from './parseEventParams'

/**
 * @deprecated use {apiGatewayProxyHandlerFactory.js}
 *
 * @param bodyHandler
 * @returns {function(*=, *=, *)}
 */
export default function apiGatewayProxyWrapper(bodyHandler) {

	return (event, context, callback) => {

		const done = (error, response) => {

			const statusCode = error ? '400' : '200';

			if (error) {
				// log the full error before trimming for user output
				console.log(JSON.stringify({event, context, error}, null, 4));
				if (typeof error === 'object') {
					const params = parseEventParams(event);
					error.requestId = params.requestParams.requestId;
					if (params.requestParams.stage === 'prod') {
						// do not publish error info to prod users
						delete error.error;
					}
				}
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

		// NOTE returning a Promise result is for testing harness and has no
		// effect on the lambda function itself

		try {
			const eventBody = parseEventBody(event);
			return bodyHandler(eventBody.body, event, context)
				.then((result) => done(null, result))
				.catch(done);
		} catch (error) {
			const requestId = path.get(event, 'requestContext.requestId');
			console.log(JSON.stringify({event, context, error}, null, 8));
			done({code: 'InvalidRequest', message: 'Parse error.', requestId});
			return Promise.reject(error);
		}

	};

}

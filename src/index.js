
export function apiGatewayProxyWrapper(bodyHandler) {

	return (event, context, callback) => {

		console.log(JSON.stringify({event, context}, null, 4));

		const done = (err, res) => {

			let body = '';

			const statusCode = err ? '400' : '200';

			if (err) {
				body = err instanceof Array ? err : [err];
			} else {
				body = res;
			}

			callback(null, {
				statusCode,
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json'
				}
			});

		};

		if (!(event && typeof event.body === 'string')) {
			return done({code: 'InvalidRequest', message: 'Missing data.'});
		}

		try {
			const userInput = JSON.parse(event.body);
			console.log(JSON.stringify({userInput}, null, 4));
			console.log(bodyHandler);
			bodyHandler(userInput).then((result) => done(null, result)).catch(done);
		} catch (error) {
			return done({code: 'InvalidRequest', message: 'Parse error.'});
		}

	};

}

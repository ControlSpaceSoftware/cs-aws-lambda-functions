
export function apiGatewayProxyWrapper(bodyHandler) {

	return (event, context, callback) => {

		const done = (err, res) => {

			let body = '';

			const statusCode = err ? '400' : '200';

			if (err) {
				console.log(JSON.stringify({event, context, err}, null, 4));
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
			bodyHandler(userInput).then((result) => done(null, result)).catch(done);
		} catch (error) {
			console.log('error', error);
			return done({code: 'InvalidRequest', message: 'Parse error.'});
		}

	};

}

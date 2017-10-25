import {getS3Object} from './getS3Object'

/**
 * Given array of keys, get the S3 objects and parse as json. Returns
 * list of JSON objects.
 *
 * Ignores getS3Object() 'NoSuchKey' errors. Writes errors to resolve list.
 * Consumers must check each object to see if typeof obj === 'object'.
 *
 * @param provider
 * @param bucket
 * @param keys Array<String> or String
 * @returns {Promise.<*[]>}
 */
export function getS3ObjectsAsJson({provider, bucket, keys}) {

	if (!(keys && (keys instanceof Array || typeof keys === 'string'))) {
		throw new TypeError('keys parameter is missing');
	}

	if (!(provider && typeof provider.getObject === 'function')) {
		throw new TypeError('provider.getObject(params, function(err, data)) is missing');
	}

	if (!(bucket && typeof bucket === 'string')) {
		throw new TypeError('bucket parameter is missing');
	}

	if (typeof keys === 'string') {
		keys = [keys];
	}

	keys.forEach((key) => {
		if (!(key && typeof key === 'string')) {
			throw new TypeError('key parameter is missing');
		}
	});

	const load = (key) => new Promise((resolve) => {
		getS3Object({provider, bucket, key})
			.then((result) => {
				if (result && typeof result.response === 'object') {
					try {
						let json;
						if (result.hasOwnProperty('Body')) {
							json = result.response.Body.toString('utf-8');
						} else {
							// todo why does this happen?
							json = result.response.object.Body.toString('utf-8');
						}
						resolve(JSON.parse(json));
					} catch (ignore) {
						console.log(ignore);
						console.log(JSON.stringify(result));
					}
				}
				resolve({});
			})
			.catch((error) => {
				if (error && error.code === 'NoSuchKey') {
					resolve({});
				} else {
					console.log(error);
					resolve({});
				}
			});
	});

	return Promise.all(keys.map(load));

}

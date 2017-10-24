export default function getS3Object({provider, bucket, key}) {

	if (!(provider && typeof provider.getObject === 'function')) {
		throw new TypeError('provider.getObject(params, function(err, data)) is missing');
	}

	if (!(bucket && typeof bucket === 'string')) {
		throw new TypeError('bucket parameter is missing');
	}

	if (!(key && typeof key === 'string')) {
		throw new TypeError('key parameter is missing');
	}

	return new Promise((resolve, reject) => {
		const getParams = {
			Bucket: bucket,
			Key: key
		};
		provider.getObject(getParams, (error, object) => error ? reject(error) : resolve({bucket, key, object}));
	});

}

'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getS3Object = getS3Object;
function getS3Object(_ref) {
	var provider = _ref.provider,
	    bucket = _ref.bucket,
	    key = _ref.key;


	if (!(provider && typeof provider.getObject === 'function')) {
		throw new TypeError('provider.getObject(params, function(err, data)) is missing');
	}

	if (!(bucket && typeof bucket === 'string')) {
		throw new TypeError('bucket parameter is missing');
	}

	if (!(key && typeof key === 'string')) {
		throw new TypeError('key parameter is missing');
	}

	return new Promise(function (resolve, reject) {
		var getParams = {
			Bucket: bucket,
			Key: key
		};
		provider.getObject(getParams, function (error, response) {
			return error ? reject(error) : resolve({ bucket: bucket, key: key, response: response });
		});
	});
}
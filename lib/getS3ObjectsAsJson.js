'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getS3ObjectsAsJson = getS3ObjectsAsJson;

var _getS3Object = require('./getS3Object');

var logError = function logError(error) {
	if (error && error.code !== 'NoSuchKey') {
		console.log(error);
	}
	return error;
};

/**
 * Given array of keys, get the S3 objects and parse as json. Returns
 * list of JSON objects.
 *
 * Ignores getS3Object() errors. Writes errors other than 'NoSuchKey'
 * to console.log. Errors return empty JSON object.
 *
 * @param provider
 * @param bucket
 * @param keys Array<String> or String
 * @returns {Promise.<*[]>}
 */
function getS3ObjectsAsJson(_ref) {
	var provider = _ref.provider,
	    bucket = _ref.bucket,
	    keys = _ref.keys;


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

	keys.forEach(function (key) {
		if (!(key && typeof key === 'string')) {
			throw new TypeError('key parameter is missing');
		}
	});

	var load = function load(key) {
		return new Promise(function (resolve) {
			(0, _getS3Object.getS3Object)({ provider: provider, bucket: bucket, key: key }).then(function (result) {
				if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
					try {
						var json = result.response.object.Body.toString('utf-8');
						resolve(JSON.parse(json));
					} catch (ignore) {}
				}
				resolve({});
			}).catch(function (error) {
				logError(error);
				resolve({});
			});
		});
	};

	return Promise.all(keys.map(load));
}
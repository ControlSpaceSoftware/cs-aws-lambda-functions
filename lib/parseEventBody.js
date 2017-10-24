'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.parseEventBody = parseEventBody;

var _ovObjectPath = require('ov-object-path');

var _ovObjectPath2 = _interopRequireDefault(_ovObjectPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseEventBody(event) {

	var body = _ovObjectPath2.default.get(event, 'body');

	return {
		get body() {
			if (body && typeof body === 'string') {
				return JSON.parse(event.body);
			}
			return body;
		}
	};
}
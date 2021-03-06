'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.parseEventUserInfo = parseEventUserInfo;

var _ovObjectPath = require('ov-object-path');

var _ovObjectPath2 = _interopRequireDefault(_ovObjectPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseEventUserInfo(event) {

	var userInfo = _ovObjectPath2.default.get(event, 'requestContext.authorizer.claims');

	return { userInfo: userInfo };
}
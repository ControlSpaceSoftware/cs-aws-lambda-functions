'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = parseEvent;

var _parseEventBody = require('./parseEventBody');

var _parseEventBody2 = _interopRequireDefault(_parseEventBody);

var _parseEventParams = require('./parseEventParams');

var _parseEventParams2 = _interopRequireDefault(_parseEventParams);

var _parseEventUserInfo = require('./parseEventUserInfo');

var _parseEventUserInfo2 = _interopRequireDefault(_parseEventUserInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseEvent(event) {

	return Object.assign({}, (0, _parseEventBody2.default)(event), (0, _parseEventParams2.default)(event), (0, _parseEventUserInfo2.default)(event));
}
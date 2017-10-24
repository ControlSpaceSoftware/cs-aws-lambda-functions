'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.parseEvent = parseEvent;

var _parseEventBody = require('./parseEventBody');

var _parseEventParams = require('./parseEventParams');

var _parseEventUserInfo = require('./parseEventUserInfo');

function parseEvent(event) {

	return Object.assign({}, (0, _parseEventBody.parseEventBody)(event), (0, _parseEventParams.parseEventParams)(event), (0, _parseEventUserInfo.parseEventUserInfo)(event));
}
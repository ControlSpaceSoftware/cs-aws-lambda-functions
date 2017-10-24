import path from 'ov-object-path'
export function parseEventParams(event) {

	const pathParams = path.get(event, 'pathParameters') || {};
	const stageParams = path.get(event, 'stageVariables') || {};
	const queryParams = path.get(event, 'queryStringParameters') || {};
	const requestContext = path.get(event, 'requestContext') || {};

	const requestParams  = Object.keys(requestContext).reduce((map, key) => {
		if (typeof requestContext[key] === 'string') {
			map[key] = requestContext[key];
		}
		return map;
	}, {});

	return {pathParams, stageParams, queryParams, requestParams};

}

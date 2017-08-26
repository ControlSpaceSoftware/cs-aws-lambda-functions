import path from 'ov-object-path'
export default function parseEvent(event) {

	const pathParams = path.get(event, 'pathParameters') || {};
	const stageParams = path.get(event, 'stageVariables') || {};
	const queryParams = path.get(event, 'queryStringParameters') || {};

	return {pathParams, stageParams, queryParams};

}

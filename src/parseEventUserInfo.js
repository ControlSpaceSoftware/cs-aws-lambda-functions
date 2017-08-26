import path from 'ov-object-path'
export default function parseEvent(event) {

	const userInfo = path.get(event, 'requestContext.authorizer.claims') || {};

	return {userInfo};

}

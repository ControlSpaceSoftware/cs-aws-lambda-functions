import path from 'ov-object-path'

export function parseEventUserInfo(event) {

	const userInfo = path.get(event, 'requestContext.authorizer.claims');

	return {userInfo};

}

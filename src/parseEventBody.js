import path from 'ov-object-path'
export default function parseEventBody(event) {

	const body = path.get(event, 'body');

	return {
		get body() {
			if (body && typeof body === 'string') {
				return JSON.parse(event.body);
			}
			return body;
		}
	};

}

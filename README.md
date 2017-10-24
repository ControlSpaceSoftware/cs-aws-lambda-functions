# cs-aws-lambda-functions

## apiGatewayProxyWrapper(bodyHandler)

Boilerplate code for an API Gateway proxy request to this lambda function.

## Install
npm install github:ControlSpaceSoftware/cs-aws-lambda-functions.git --save

## Usage

```
// index.js:
import { apiGatewayProxyWrapper } from 'cs-aws-lambda-functions'

const bodyHandler = (eventBodyFromApiGateway) => {
	return new Promise((resolve, reject) => {
		if (eventBodyFromApiGateway) {
			resolve('some response');
		} else {
			reject('some error')
		}
	});
};
exports.handler = apiGatewayProxyWrapper(bodyHandler);

```

### Errors

If event is missing or event.body is not a string, returns statusCode 400 with json message:
```
{code: 'InvalidRequest', message: 'Missing data.'}
```

If event.body JSON.parse error, returns statusCode 400 with json message:
```
{code: 'InvalidRequest', message: 'Parse error.'}
```

## getS3Object({provider, bucket, key})

## Install
npm install github:ControlSpaceSoftware/cs-aws-lambda-functions.git --save

## Usage
```
// index.js:
import { getS3Object } from 'cs-aws-lambda-functions'

getS3Object({provider: AWS.S3, bucket: 'mybucket', key: 'mykey'}).then(...).catch(...);

```

### Errors
Throws error if provider does not support getObject method, bucket is missing or key is missing.

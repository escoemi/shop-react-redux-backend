import { APIGatewayAuthorizerEvent } from "aws-lambda";

const isAuthorized = (name: string, password: string) => {
  const storedPassword = process.env[name];
  const isAllowed = storedPassword && storedPassword === password;
  return isAllowed;
};

const generatePolicy = (
  principalId: string,
  arn: string,
  isAllowed: boolean
) => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: isAllowed ? "Allow" : "Deny",
        Resource: arn,
      },
    ],
  },
});

const getParsedAccess=(authorizationToken:string)=>{
  const encodedCredentials = authorizationToken.split(' ')[1];
  const credentialsBuffer = Buffer.from(encodedCredentials, 'base64');
  return credentialsBuffer.toString('utf-8').split(':');
}

export const getPolicy = (authorizationToken: string, arn: string) => {
  const [name, password] = getParsedAccess(authorizationToken);
  const isAllowed = isAuthorized(name, password);
  return generatePolicy(name, arn, isAllowed);
};

export const validateEventType = (
  event: APIGatewayAuthorizerEvent,
  callback: (message: string) => void
) => {
  if (event?.["type"] !== "TOKEN") {
    console.log("You need to specify a token first");
    callback(`Unauthorized: ${JSON.stringify(event)}`);
  }
};

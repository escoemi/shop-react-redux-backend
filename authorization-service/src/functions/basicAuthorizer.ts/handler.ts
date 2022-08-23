import { APIGatewayAuthorizerHandler } from "aws-lambda";
import {
  getPolicy,
  validateEventType,
} from "src/services/authService";

export const basicAuthorizer: APIGatewayAuthorizerHandler = (
  event,
  _context,
  callback
) => {
  console.log(event);
  try {
    validateEventType(event, callback);
    //@ts-ignore
    const policy = getPolicy(event.authorizationToken, event.methodArn);

    callback(null, policy);
  } catch (e) {
    callback(`Unauthorized: ${JSON.stringify(e)}`);
  }
};
import { SQS } from "aws-sdk";
import { SendMessageRequest } from "aws-sdk/clients/sqs";

export const getSQSInstance = () => {
  return new SQS({ region: process.env.SQS_REGION });
};

export const sendSQSMessage = (messageBody: string): void => {
  const sqs = getSQSInstance();
  const messageRequest: SendMessageRequest = {
    QueueUrl: process.env.SQS_URL,
    MessageBody: messageBody,
  };

  sqs.sendMessage(messageRequest, console.log);
};

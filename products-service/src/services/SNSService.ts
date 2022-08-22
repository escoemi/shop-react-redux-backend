import { SNS } from "aws-sdk";

export const getSNSInstance = () => {
  return new SNS({ region: process.env.SNS_REGION });
};

export const publishSNSMessage = async(subject:string, message:string, messageAttributes?:SNS.MessageAttributeMap) => {
  const sns=getSNSInstance();
  await sns
    .publish(
      {
        Subject: subject,
        Message: message,
        TopicArn: process.env.SNS_ARN,
        MessageAttributes: messageAttributes
      },
      console.log
    )
    .promise();
};

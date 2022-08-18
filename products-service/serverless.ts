import type { AWS } from "@serverless/typescript";
import getProducts from "@functions/getProducts";
import getProductsById from "@functions/getProductsById";
import createProduct from "@functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";

const serverlessConfiguration: AWS = {
  service: "products-service-task-4",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-dotenv-plugin"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-2",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      SNS_ARN: {
        Ref: "SNSTopic",
      },
      SNS_REGION: "us-east-2",
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "sns:*",
            Resource: [
              "arn:aws:sns:us-east-2:016632548581:createProductTopic:0f7971f9-66e6-4868-bcee-614f4a22ed99",
            ],
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      SNSSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: process.env.USER_MAIL_1,
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic",
          },
          FilterPolicy: {
            productCount: [{ numeric: ['<', 5] }],
          },
        },
      },
      SNSSubscriptionThreshold: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: process.env.USER_MAIL_2,
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic",
          },
          FilterPolicy: {
            productCount: [{ numeric: ['>=', 5] }],
          },
        },
      },
    },
  },
  // import the function via paths
  functions: {
    getProducts,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk", "pg-native"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    webpack: {
      webpackConfig: "webpack.config.js",
      includeModule: true,
    },
  },
};

module.exports = serverlessConfiguration;

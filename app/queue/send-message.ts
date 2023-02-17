// import { logger } from '@config/logger';
import { Service } from "typedi";
import { SQS } from "./aws";

interface ISendMessage {
  DelaySeconds?: number;
  MessageAttributes?: any;
  MessageBody: string;
  QueueUrl: string;
}

interface IReceiveMessage {
  AttributeNames: Array<string>;
  MaxNumberOfMessages: number;
  MessageAttributeNames: Array<string>;
  QueueUrl: string;
  VisibilityTimeout: number;
  WaitTimeSeconds: number;
}

@Service()
export class SendMessage {
  async send(params: ISendMessage) {
    try {
      const data = await SQS.sendMessage(params).promise();
      return data;
    } catch (error) {
      console.log("Error", error);
      throw new Error(error);
    }
  }
  async receive(params: IReceiveMessage) {
    try {
      const data = await SQS.receiveMessage(params).promise();
      return data;
    } catch (error) {
      console.log("Error", error);
      throw new Error(error);
    }
  }
}

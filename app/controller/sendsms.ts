//import { APIGatewayEvent } from "aws-lambda";
import { MessageUtil } from "../utils/message";
import { Service } from "typedi";
import { SendSmsService } from "../service/notifications.service";
import { APIGatewayEvent } from "aws-lambda";
import {
  ReceiptNotification,
  mapperReceiptNotification,
} from "../model/dto/receiptNotificationDTO";
// import { validate } from "class-validator";
import { Notification } from "../model/notifications";
// import { mapperSend, Send } from "../model/dto/sendDTO";
// import { Data, mapperData } from "../model/dto/dataDTO";

@Service()
export class SendsmsController {
  constructor(private service: SendSmsService) {}

  async sendsms(event: APIGatewayEvent): Promise<MessageUtil> {
    // const params: Notification = JSON.parse(event.body);
    const params: Notification = JSON.parse(event["Records"][0].body);
    const receiptNotification: ReceiptNotification =
        mapperReceiptNotification(params);
    try {
      //class-validator
      //const params: Notification = JSON.parse(event['Records'][0].body);
      //const params: Notification = JSON.parse(event.body);
      const notificationId =
      event["Records"][0]["messageAttributes"]["id"]["stringValue"];
      const response = await this.service.sendSms(receiptNotification,notificationId);
      return MessageUtil.success(response);
    } catch (error) {
      console.error(error);
      return MessageUtil.error(error.code, error.message);
    }
  }
}
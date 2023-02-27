import { MessageUtil } from "../utils/message";
import { Service } from "typedi";
import { SendSmsService } from "../service/notifications.service";
import { APIGatewayEvent } from "aws-lambda";
import {
  ReceiptNotification,
  mapperReceiptNotification,
} from "../model/dto/receiptNotificationDTO";
import { Notification } from "../model/notifications";

@Service()
export class SendsmsController {
  constructor(private service: SendSmsService) {}

  // The 'sendsms' function receives an object of type APIGatewayEvent and returns a Promise
  async sendsms(event: APIGatewayEvent): Promise<MessageUtil> {
    // Get message data from the 'event' object
    //const params: Notification = JSON.parse(event.body);
    const params: Notification = JSON.parse(event["Records"][0].body);
    // Map the received notification into a 'ReceiptNotification' object
    const receiptNotification: ReceiptNotification =
        mapperReceiptNotification(params);
    try {
      // Get the notification ID
      //const params: Notification = JSON.parse(event.body);
      const notificationId =
      event["Records"][0]["messageAttributes"]["id"]["stringValue"];
      // Call the 'sendSms' method of the corresponding service and pass the necessary data
      const response = await this.service.sendSms(receiptNotification,notificationId);
      // Return a response with the content of the 'response' object
      return MessageUtil.success(response);
    } catch (error) {
      // If an error occurs, display a console message with the error and return an error response
      console.error(error);
      return MessageUtil.error(error.code, error.message);
    }
  }
}
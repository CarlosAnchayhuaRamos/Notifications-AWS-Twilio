import { MessageUtil } from "../utils/message";
import { Service } from "typedi";
import { SendWhatsappService } from "../service/notifications.service";
import { APIGatewayEvent } from "aws-lambda";
import {
  ReceiptNotification,
  mapperReceiptNotification,
} from "../model/dto/receiptNotificationDTO";
import { Notification } from "../model/notifications";

@Service()
export class SendwhatsappController {
  constructor(private service: SendWhatsappService) {}

  async sendwhatsapp(event: APIGatewayEvent): Promise<MessageUtil> {
    // Parse the Notification object from the message body
    const params: Notification = JSON.parse(event["Records"][0].body);

    // Map the Notification object to ReceiptNotification object
    const receiptNotification: ReceiptNotification = mapperReceiptNotification(params);

    try {
      // Get the notification id from the message attributes
      const notificationId = event["Records"][0]["messageAttributes"]["id"]["stringValue"];

      // Send the notification via Whatsapp service
      const response = await this.service.sendWhatsapp(receiptNotification, notificationId);

      // Return the success response
      return MessageUtil.success(response);

    } catch (error) {
      // Log the error
      console.error(error);

      // Return the error response
      return MessageUtil.error(error.code, error.message);
    }
  }
}
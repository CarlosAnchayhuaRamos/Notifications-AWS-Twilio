import { MessageUtil } from "../utils/message";
import { Service } from "typedi";
import { SendMailService } from "../service/notifications.service";
import { APIGatewayEvent } from "aws-lambda";
import {
  ReceiptNotification,
  mapperReceiptNotification,
} from "../model/dto/receiptNotificationDTO";
import { Notification } from "../model/notifications";

// Use the @Service decorator from typedi to mark this class as a service
@Service()
export class SendmailController {
  constructor(private service: SendMailService) {}

  // Define an async function called "sendMail" that takes an APIGatewayEvent parameter and returns a Promise of MessageUtil
  async sendMail(event: APIGatewayEvent): Promise<MessageUtil> {
    // Parse the JSON body of the event into a Notification object
    //const params: Notification = JSON.parse(event.body);
    const params: Notification = JSON.parse(event["Records"][0].body);
    // Map the Notification object to a ReceiptNotification object
    const receiptNotification: ReceiptNotification =
      mapperReceiptNotification(params);

    try {
      // Get the notification ID from the message attributes of the event
      //const params: Notification = JSON.parse(event.body);
      const notificationId = 
        event["Records"][0]["messageAttributes"]["id"]["stringValue"];
      // Log the notification ID and receipt notification to the console
      console.log('NOTIFICACION ID', notificationId)
      console.log('RECEIPT NOTIFICATION', receiptNotification)
      // Call the "sendMail" method on the injected service with the receiptNotification and notificationId as parameters
      const response = await this.service.sendMail(
        receiptNotification,
        notificationId
      );
      // Return a success message with the response using the "success" method of the MessageUtil class
      return MessageUtil.success(response);
    } catch (error) {
      // Log the error to the console
      console.error(error);
      // Return an error message with the error code and message using the "error" method of the MessageUtil class
      return MessageUtil.error(error.code, error.message);
    }
  }
}

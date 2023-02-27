import { APIGatewayEvent } from "aws-lambda";
import { MessageUtil, parseValidationErrors } from "../utils/message";
import { Service } from "typedi";
import { NotificationsService } from "../service/notifications.service";
import {
  ReceiptNotification,
  mapperReceiptNotification,
} from "../model/dto/receiptNotificationDTO";
import { validate } from "class-validator";
import { Notification } from "../model/notifications";
import { mapperSend, Send } from "../model/dto/sendDTO";
import { Data, mapperData } from "../model/dto/dataDTO";

@Service()
export class NotificationsController {
  constructor(private service: NotificationsService) {}

  // Receipt endpoint to handle incoming notifications
  async receipt(event: APIGatewayEvent): Promise<MessageUtil> {
    const params: Notification = JSON.parse(event.body);
    try {
      // Map the Notification object to ReceiptNotification object
      const receiptNotification: ReceiptNotification =
        mapperReceiptNotification(params);
      
      // Validate the ReceiptNotification object using class-validator library
      const dtoValidation = await validate(receiptNotification);
      if (dtoValidation && dtoValidation.length > 0) {
        // If there are validation errors, return an error message
        const errors = parseValidationErrors(dtoValidation);
        return MessageUtil.error(404, errors);
      }

      // Map the Send object inside Notification to SendDTO object
      const send: Send = mapperSend(params.send);
      const dtoValidationSend = await validate(send);
      if (dtoValidationSend && dtoValidationSend.length > 0) {
        const errors = parseValidationErrors(dtoValidationSend);
        return MessageUtil.error(404, errors);
      }

      // Map the Data object inside Notification to DataDTO object
      const data: Data = mapperData(params.data);
      const dtoValidationData = await validate(data);
      if (dtoValidationData && dtoValidationData.length > 0) {
        const errors = parseValidationErrors(dtoValidationData);
        return MessageUtil.error(404, errors);
      } 

      // Create the notification using the service and return a success message
      const response = await this.service.createNotification(receiptNotification);
      return MessageUtil.success(response);
    } catch (error) {
      // If there is an error, log it and return an error message
      console.error(error);
      return MessageUtil.error(error.code, error.message);
    }
  }
}

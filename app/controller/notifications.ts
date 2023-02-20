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

  async receipt(event: APIGatewayEvent): Promise<MessageUtil> {
    const params: Notification = JSON.parse(event.body);
    try {
      const receiptNotification: ReceiptNotification =
        mapperReceiptNotification(params);
      const dtoValidation = await validate(receiptNotification);
      if (dtoValidation && dtoValidation.length > 0) {
        const errors = parseValidationErrors(dtoValidation);
        return MessageUtil.error(404, errors);
      }
      const send: Send = mapperSend(params.send);
      const dtoValidationSend = await validate(send);
      if (dtoValidationSend && dtoValidationSend.length > 0) {
        const errors = parseValidationErrors(dtoValidationSend);
        return MessageUtil.error(404, errors);
      }
      const data: Data = mapperData(params.data);
      const dtoValidationData = await validate(data);
      if (dtoValidationData && dtoValidationData.length > 0) {
        const errors = parseValidationErrors(dtoValidationData);
        return MessageUtil.error(404, errors);
      } 
      if(receiptNotification.type = "COMPOUND"){
        const response = await this.service.createNotification(receiptNotification);
      return MessageUtil.success(response);
      } else {

      }
      

    } catch (error) {
      console.error(error);
      return MessageUtil.error(error.code, error.message);
    }
  }
}

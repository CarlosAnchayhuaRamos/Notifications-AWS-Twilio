import { Service } from "typedi";
import { ReceiptNotification } from "../model/dto/receiptNotificationDTO";
import { NotificationRepository } from "../repository/notification.repository";
import {
  CHANNEL_EMAIL,
  CHANNEL_PUSH,
  TIME_SEND_SCHEDULE,
  MAX_BODY_SIZE_EMAIL,
  MAX_BODY_SIZE_SMS,
  MAX_BODY_SIZE_PUSH_NOTIFICATION,
  MAX_BODY_SIZE_WHATSAPP,
  CHANNEL_WHATSAPP,
  CHANNEL_SMS,
} from "../utils/constants";
import { SendMessage } from "../queue/send-message";
import { MailDataRequired, setApiKey, send } from "@sendgrid/mail";
import Twilio from "twilio";
import {
  SQS_MAIL_URL,
  SQS_WHATSAPP_URL,
  SQS_SMS_URL,
  SQS_PUSH_URL,
  MAX_ATTEMPTS
} from "../utils/constants";
import { notificationModel } from "../model/notification/notification.model";
import { NotificationDocument } from "../model/notification/notification.model";
//import { toBase64URL } from 'base64url';

@Service()
export class NotificationsService {
  constructor(
    private notificationRepository: NotificationRepository,
    private queue: SendMessage
  ) {}

  async createNotification(receiptNotification: ReceiptNotification) {
    await this.fieldValidation(receiptNotification);
    receiptNotification.data.to = this.removeDuplicates(receiptNotification.data.to);
    const notificationToSend = {
      ...receiptNotification,
      status: "PENDING",
      attempts: 0,
    };
    try {
      const notificationVo = new this.notificationRepository.model(
        notificationToSend
      );
      const notification = await this.notificationRepository.model.create(
        notificationVo
      );
      if (notification.type == "SINGLE") {
        await this.sendSQS(notification);
      }
      return {
        code: 201,
        response: notification,
      };
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  validateEmail(email: string) {
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailPattern.test(email);
  }
  
  validateEmailList(emailList: string[]) {
    return emailList.every(email => this.validateEmail(email));
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    const phoneNumberPattern = /^\+\d{2,3}\d{7,15}$/;
    return phoneNumberPattern.test(phoneNumber);
  }

  validatePhoneNumberList(PhoneNumberList: string[]) {
    return PhoneNumberList.every(PhoneNumber => this.validatePhoneNumber(PhoneNumber));
  }

  removeDuplicates(numbers: string[]): string[] {
    const uniqueNumbers = numbers.filter((number, index) => {
      return index === numbers.indexOf(number);
    });
    return uniqueNumbers;
  }

  fieldValidation(receiptNotification: ReceiptNotification) {
    // VALIDATION WHEN THE SEND IS PROGRAMMED
    if (
      receiptNotification?.type == "PROGRAMMED" &&
      !receiptNotification?.send?.date
    ) {
      throw new Error("You have to enter a date");
    }

    // VALIDATION TYPE CHANNEL
    if (
      receiptNotification?.channel == CHANNEL_EMAIL &&
      (!receiptNotification?.data?.title || !receiptNotification?.data?.from || !this.validateEmailList(receiptNotification?.data?.to) || !this.validateEmail(receiptNotification?.data?.from))
    ) {
      throw new Error("Title, To and From is requerid in the correct format");
    }

    // VALIDATION TYPE WHATSAPP
    if (
      (receiptNotification?.channel == CHANNEL_WHATSAPP || receiptNotification?.channel == CHANNEL_SMS) &&
      (!this.validatePhoneNumberList(receiptNotification?.data?.to) || !this.validatePhoneNumber(receiptNotification?.data?.from))
    ) {
      throw new Error("To and From is requerid in the correct format");
    }

    // VALIDATION LENGTH
    if (
      (receiptNotification?.channel == CHANNEL_EMAIL &&
        receiptNotification?.data?.body.length >= MAX_BODY_SIZE_EMAIL) ||
      (receiptNotification?.channel == CHANNEL_PUSH &&
        receiptNotification?.data?.body.length >=
          MAX_BODY_SIZE_PUSH_NOTIFICATION) ||
      (receiptNotification?.channel == CHANNEL_WHATSAPP &&
        receiptNotification?.data?.body.length >= MAX_BODY_SIZE_WHATSAPP) ||
      (receiptNotification?.channel == CHANNEL_SMS &&
        receiptNotification?.data?.body.length >= MAX_BODY_SIZE_SMS)
    ) {
      throw new Error("The body is too long");
    }

    if (
      receiptNotification?.channel == CHANNEL_PUSH &&
      !receiptNotification?.data?.title
    ) {
      throw new Error("Title is requerid");
    }
  }

  async sendSQS(notification) {
    switch (notification.channel) {
      case "EMAIL": {
        const message = await this.queue.send({
          DelaySeconds: 10,
          MessageBody: JSON.stringify(notification),
          MessageAttributes: {
            id: {
              DataType: "String",
              StringValue: notification._id.toString(),
            },
          },
          QueueUrl: SQS_MAIL_URL,
        });
        console.log("message Id queue", notification._id.toString());
        console.log("message Id queue", message.MessageId);
        break;
      }
      case "WHATSAPP": {
        const message = await this.queue.send({
          DelaySeconds: 10,
          MessageBody: JSON.stringify(notification),
          MessageAttributes: {
            id: {
              DataType: "String",
              StringValue: notification._id.toString(),
            },
          },
          QueueUrl: SQS_WHATSAPP_URL,
        });
        console.log("message Id queue", notification._id.toString());
        console.log("message Id queue", message.MessageId);
        break;
      }
      case "SMS": {
        const message = await this.queue.send({
          DelaySeconds: 10,
          MessageBody: JSON.stringify(notification),
          MessageAttributes: {
            id: {
              DataType: "String",
              StringValue: notification._id.toString(),
            },
          },
          QueueUrl: SQS_SMS_URL,
        });
        console.log("message Id queue", notification._id.toString());
        console.log("message Id queue", message.MessageId);
        break;
      }
      case "PUSH": {
        const message = await this.queue.send({
          DelaySeconds: 10,
          MessageBody: JSON.stringify(notification),
          MessageAttributes: {
            id: {
              DataType: "String",
              StringValue: notification._id.toString(),
            },
          },
          QueueUrl: SQS_PUSH_URL,
        });
        console.log("message Id queue", notification._id.toString());
        console.log("message Id queue", message.MessageId);
        break;
      }
      default: {
        break;
      }
    }
  }
}

@Service()
export class SchedulService {
  constructor(
    private queue: SendMessage
  ) {}

  async sendSQS(notification) {
    switch (notification.channel) {
      case "EMAIL": {
        const message = await this.queue.send({
          DelaySeconds: 10,
          MessageBody: JSON.stringify(notification),
          MessageAttributes: {
            id: {
              DataType: "String",
              StringValue: notification._id.toString(),
            },
          },
          QueueUrl: SQS_MAIL_URL,
        });
        console.log("message Id queue", notification._id.toString());
        console.log("message Id queue", message.MessageId);
        break;
      }
      case "WHATSAPP": {
        const message = await this.queue.send({
          DelaySeconds: 10,
          MessageBody: JSON.stringify(notification),
          MessageAttributes: {
            id: {
              DataType: "String",
              StringValue: notification._id.toString(),
            },
          },
          QueueUrl: SQS_WHATSAPP_URL,
        });
        console.log("message Id queue", notification._id.toString());
        console.log("message Id queue", message.MessageId);
        break;
      }
      case "SMS": {
        const message = await this.queue.send({
          DelaySeconds: 10,
          MessageBody: JSON.stringify(notification),
          MessageAttributes: {
            id: {
              DataType: "String",
              StringValue: notification._id.toString(),
            },
          },
          QueueUrl: SQS_SMS_URL,
        });
        console.log("message Id queue", notification._id.toString());
        console.log("message Id queue", message.MessageId);
        break;
      }
      case "PUSH": {
        const message = await this.queue.send({
          DelaySeconds: 10,
          MessageBody: JSON.stringify(notification),
          MessageAttributes: {
            id: {
              DataType: "String",
              StringValue: notification._id.toString(),
            },
          },
          QueueUrl: SQS_PUSH_URL,
        });
        console.log("message Id queue", notification._id.toString());
        console.log("message Id queue", message.MessageId);
        break;
      }
      default: {
        break;
      }
    }
  }

  async findNotifications() {
    try {
      const roundToMinutes = (date: Date): Date => {
        date.setSeconds(0, 0);
        return date;
      };
      const now = roundToMinutes(new Date());
      const fiveMinutesAgo = new Date(
        now.getTime() - TIME_SEND_SCHEDULE * 60 * 1000
      );
      const objSearch = {
        $or: [
          {
            type: "PROGRAMMED",
            "send.date": { $gt: new Date(fiveMinutesAgo), $lte: new Date(now) },
          },
          { 
            type: "SINGLE", 
            status: "PENDING", 
            attempts: { $gte: 1 }
          }
        ]
      }
      
      const notification = await notificationModel.find(objSearch);

      for (const item in notification) {
          await this.sendSQS(notification[item]);
      }

      // notification.forEach(async (item) => {
      //   await this.sendSQS(item);
      // });
      return {
        code: 201,
        response: notification,
      };
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  async find(objSearch?: any) {
    try {
      const result = await this.find(objSearch);
      return result;
    } catch (err) {
      console.log(err);
      throw new Error(`El objeto a buscar no se encontro: ${objSearch}`);
    }
  }
}

//SEND MAIL
@Service()
export class SendMailService {
  constructor(private notificationRepository: NotificationRepository) {}

  async sendMail(
    receiptNotification: ReceiptNotification,
    notificationId: string
  ) {
    // ## GET ID NOTIFICATION IN EVENT
    const id = notificationId;
    // ## CONFIGURATION SENGRID
    const to = receiptNotification.data.to;
    const body = receiptNotification.data.body;
    const from = receiptNotification.data.from;
    const title = receiptNotification.data.title;

    const notification = await this.findOneBy({ _id: id });

    if (
      !notification?.status ||
      notification?.status == "SENT" ||
      notification?.status == "SENT_ERROR"
    ) {
      throw new Error(
        `Esta notificacion no pueden ser enviada ${id} => Estado: ${notification?.status}`
      );
    }

    try {
      //send grid
      setApiKey(process.env.SENDGRID_API_KEY);
      const msg: MailDataRequired = {
        to: to,
        from: from || "service-account@delfosti.com",
        subject: title,
        html: body,
      };
      await send(msg);

      // BEGIN: UPDATE NOTIFICATION
      notification.status = "SENT";
      notification.attempts++;
      const notificationUpdate = await notification.save();
      // EMD: UPDATE NOTIFICATION

      return {
        code: 201,
        response: {
          msg: "Mensaje enviado con éxito",
          result: notificationUpdate,
        },
      };
    } catch (err) {
      // BEGIN: UPDATE NOTIFICATION
      notification.status =
        notification.attempts == (MAX_ATTEMPTS - 1) ? "SENT_ERROR" : "PENDING";
      notification.attempts++;
      await notification.save();
      // EMD: UPDATE NOTIFICATION
      console.error(err);
      throw new Error(err);
    }
  }

  async findOneBy(objSearch?: any): Promise<NotificationDocument> {
    try {
      const result = await this.notificationRepository.model.findOne(objSearch);
      return result;
    } catch (err) {
      console.log(err);
      throw new Error(`El objeto a buscar no se encontro: ${objSearch}`);
    }
  }
}

//SEND WHATSAPP
@Service()
export class SendWhatsappService {
  constructor(private notificationRepository: NotificationRepository) {}

  async sendWhatsapp(
    receiptNotification: ReceiptNotification,
    notificationId: string
  ) {
    // ## GET ID NOTIFICATION IN EVENT
    const id = notificationId;
    // ## CONFIGURATION TWILIO
    const to = receiptNotification.data.to;
    const body = receiptNotification.data.body;
    const from = receiptNotification.data.from || +14155238886;
    const title = `${receiptNotification.data.title} `;

    const notification = await this.findOneBy({ _id: id });

    if (
      !notification?.status ||
      notification?.status == "SENT" ||
      notification?.status == "SENT_ERROR"
    ) {
      throw new Error(
        `Esta notificacion no pueden ser enviada ${id} => Estado: ${notification?.status}`
      );
    }

    try {
      //send twilio
      const client = Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      
      to.forEach(async (toWhatsAppNumber) => {
        await client.messages.create({
          to: `whatsapp:${toWhatsAppNumber}`,
          from: `whatsapp:${from}`,
          body: `${title}${body}`,
        });
      });
      
      // BEGIN: UPDATE NOTIFICATION
      notification.status = "SENT";
      notification.attempts++;
      const notificationUpdate = await notification.save();
      // EMD: UPDATE NOTIFICATION

      return {
        code: 201,
        response: {
          result: notificationUpdate,
        },
      };
    } catch (err) {
      // BEGIN: UPDATE NOTIFICATION
      notification.status =
        notification.attempts == (MAX_ATTEMPTS - 1) ? "SENT_ERROR" : "PENDING";
      notification.attempts++;
      await notification.save();
      // EMD: UPDATE NOTIFICATION
      console.error(err);
      throw err;
    }
  }

  async findOneBy(objSearch?: any): Promise<NotificationDocument> {
    try {
      const result = await this.notificationRepository.model.findOne(objSearch);
      return result;
    } catch (err) {
      console.log(err);
      throw new Error(`El objeto a buscar no se encontro: ${objSearch}`);
    }
  }
}

//SEND SMS
@Service()
export class SendSmsService {
  constructor(private notificationRepository: NotificationRepository) {}

  async sendSms(receiptNotification: ReceiptNotification,
    notificationId: string) {
    // ## GET ID NOTIFICATION IN EVENT
    const id = notificationId;
    // ## CONFIGURATION TWILIO
    const to = receiptNotification.data.to;
    const body = receiptNotification.data.body;
    const from = receiptNotification.data.from || +14155238886;
    const title = `${receiptNotification.data.title} `;

    const notification = await this.findOneBy({ _id: id });

    if (
      !notification?.status ||
      notification?.status == "SENT" ||
      notification?.status == "SENT_ERROR"
    ) {
      throw new Error(
        `Esta notificacion no pueden ser enviada ${id} => Estado: ${notification?.status}`
      );
    }

    try {
      //send twilio
      const client = Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      
      to.forEach(async (toWhatsAppNumber) => {
        await client.messages.create({
          to: `${toWhatsAppNumber}`,
          from: `${from}`,
          body: `${title}${body}`,
        });
      });
      
      // BEGIN: UPDATE NOTIFICATION
      notification.status = "SENT";
      notification.attempts++;
      const notificationUpdate = await notification.save();
      // EMD: UPDATE NOTIFICATION

      return {
        code: 201,
        response: {
          result: notificationUpdate,
        },
      };
    } catch (err) {
      // BEGIN: UPDATE NOTIFICATION
      notification.status =
        notification.attempts == (MAX_ATTEMPTS - 1) ? "SENT_ERROR" : "PENDING";
      notification.attempts++;
      await notification.save();
      // EMD: UPDATE NOTIFICATION
      console.error(err);
      throw err;
    }
  }

  async findOneBy(objSearch?: any): Promise<NotificationDocument> {
    try {
      const result = await this.notificationRepository.model.findOne(objSearch);
      return result;
    } catch (err) {
      console.log(err);
      throw new Error(`El objeto a buscar no se encontro: ${objSearch}`);
    }
  }
}

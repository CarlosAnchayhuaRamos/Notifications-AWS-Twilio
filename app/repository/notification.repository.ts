import { Model } from "mongoose";
import { Service } from "typedi";
import { NotificationDocument, notificationModel } from "../model/notification/notification.model";

@Service()
export class NotificationRepository {
  model: Model<NotificationDocument>;
  constructor() {
    this.model = notificationModel;
  }
}

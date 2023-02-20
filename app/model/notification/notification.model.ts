import { Document, Model } from "mongoose";
import { notificationInstance as mongoose } from "../mongoose-db";

export interface NotificationDocument extends Document {
  channel: String;
  type: String;
  send: {
    scheduling: Boolean;
    date: Date;
  };
  data: {
    title: String;
    body: String;
    from: String;
    to: [
      {
          to: String;
          metadata: Map<string, object>;
      }
    ];
    image: String;
  };
  attempts: number;
  status: String;
}

const notificationSchema = new mongoose.Schema(
  {
    channel: { type: String, required: true },
    type: { type: String, required: true },
    send: {
      scheduling: { type: Boolean, required: true },
      date: { type: Date },
    },
    data: {
      title: { type: String },
      body: { type: String, required: true },
      from: { type: String },
      to: {
        type: [
          {
            to: { type: String },
            metadata: { type: Map, of: Object },
          },
        ],
        required: true,
      },
      image: { type: String },
    },
    attempts: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "SENT", "SENT_ERROR"],
    },
  },
  { timestamps: true }
);

export interface NotificationModel extends Model<NotificationDocument> {}

export const notificationModel = mongoose.model<
  NotificationDocument,
  NotificationModel
>("notification", notificationSchema);

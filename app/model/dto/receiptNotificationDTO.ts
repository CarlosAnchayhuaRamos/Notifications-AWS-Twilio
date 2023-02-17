import { Service } from "typedi";
import {
  IsIn,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
} from "class-validator";

import { Data, mapperData } from "./dataDTO";
import { Send, mapperSend } from "./sendDTO";

@Service()
export class ReceiptNotification {
  @IsString()
  @MinLength(3, {
    message: "Channel is too short",
  })
  @MaxLength(55, {
    message: "Channel is too long",
  })
  @IsIn(["EMAIL", "WHATSAPP", "SMS", "PUSH"], {
    message: "404 - Channel is incorrect",
  })
  channel: string;

  @IsString()
  @MinLength(5, {
    message: "Type is too short",
  })
  @MaxLength(55, {
    message: "Type is too long",
  })
  @IsIn(["SINGLE", "PROGRAMMED"], { message: "404 - Type is incorrect" })
  type: string;

  @IsIn(["PENDING", "SENT", "SENT_ERROR"], {
    message: "404 - Status is incorrect",
  })
  @IsOptional()
  status: string;

  @IsNumber()
  @IsOptional()
  attempts: number;

  send: Send;
  data: Data;

  constructor(channel: string, type: string, send: Send, data: Data) {
    this.channel = channel;
    this.type = type;
    this.send = send;
    this.data = data;
  }
}

export const mapperReceiptNotification = (
  mapper: object
): ReceiptNotification => {
  return new ReceiptNotification(
    mapper["channel"],
    mapper["type"],
    mapper["send"] ? mapperSend(mapper["send"]) : mapper["send"],
    mapper["data"] ? mapperData(mapper["data"]) : mapper["data"]
  );
};

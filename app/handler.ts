import "reflect-metadata";
import { Handler, APIGatewayEvent } from "aws-lambda";
import Container from "typedi";
import dotenv from "dotenv";
import path from "path";

import { NotificationsController } from "./controller/notifications";
const notificationsController = Container.get(NotificationsController);

import { SendmailController } from "./controller/sendmail";
const sendmailController = Container.get(SendmailController);

import { SendwhatsappController } from "./controller/sendwhatsapp";
const sendwhatsappController = Container.get(SendwhatsappController);

import { SendsmsController } from "./controller/sendsms";
const sendsmsController = Container.get(SendsmsController);

import { SchedulController } from "./controller/schedul";
const schedulController = Container.get(SchedulController);

import { connectToNotificationDatabase } from './model/mongoose-db';

const dotenvPath = path.join(
  __dirname,
  "../",
  `config/.env.${process.env.NODE_ENV}`
);
dotenv.config({
  path: dotenvPath,
});

export const receipt: Handler = async (
  event: APIGatewayEvent,
  context: any
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToNotificationDatabase();
  return notificationsController.receipt(event);
};

export const sendmail: Handler = async (
  event: APIGatewayEvent,
  context: any
) => {
  context.callbackWaitsForEmptyEventLoop = false;  
  await connectToNotificationDatabase();
  return sendmailController.sendMail(event);
};

export const sendwhatsapp: Handler = async (
  event: APIGatewayEvent,
  context: any
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToNotificationDatabase();
  return sendwhatsappController.sendwhatsapp(event);
};

export const sendsms: Handler = async (
  event: APIGatewayEvent,
  context: any
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToNotificationDatabase();
  return sendsmsController.sendsms(event);
};

export const schedul: Handler = async (
  context: any
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToNotificationDatabase();
  return schedulController.schedul();
};
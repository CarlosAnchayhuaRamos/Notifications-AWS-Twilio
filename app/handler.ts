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

// Handler function for 'receipt' endpoint
export const receipt: Handler = async (
  event: APIGatewayEvent,
  context: any
  ) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // Connect to database
  await connectToNotificationDatabase();
  // Call 'receipt' method of 'NotificationsController' and return the response
  return notificationsController.receipt(event);
  };
  
  // Handler function for 'sendmail' endpoint
  export const sendmail: Handler = async (
  event: APIGatewayEvent,
  context: any
  ) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // Connect to database
  await connectToNotificationDatabase();
  // Call 'sendMail' method of 'SendmailController' and return the response
  return sendmailController.sendMail(event);
  };
  
  // Handler function for 'sendwhatsapp' endpoint
  export const sendwhatsapp: Handler = async (
  event: APIGatewayEvent,
  context: any
  ) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // Connect to database
  await connectToNotificationDatabase();
  // Call 'sendwhatsapp' method of 'SendwhatsappController' and return the response
  return sendwhatsappController.sendwhatsapp(event);
  };
  
  // Handler function for 'sendsms' endpoint
  export const sendsms: Handler = async (
  event: APIGatewayEvent,
  context: any
  ) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // Connect to database
  await connectToNotificationDatabase();
  // Call 'sendsms' method of 'SendsmsController' and return the response
  return sendsmsController.sendsms(event);
  };
  
  // Handler function for 'schedul' endpoint
  export const schedul: Handler = async (
  context: any
  ) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // Connect to database
  await connectToNotificationDatabase();
  // Call 'schedul' method of 'SchedulController' and return the response
  return schedulController.schedul();
  };
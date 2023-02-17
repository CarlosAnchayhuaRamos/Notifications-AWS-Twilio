import * as AWS from "aws-sdk";
import { REGION } from "../utils/constants";

AWS.config.update({ region: REGION });

export const SQS = new AWS.SQS();
export const account = new AWS.STS().getCallerIdentity();

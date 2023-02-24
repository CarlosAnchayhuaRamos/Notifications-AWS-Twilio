/* MONGO*/
export const DB_URL = `mongodb+srv://${
  process.env.DATABASE_USER
    ? `${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@`
    : ""
}${process.env.DATABASE_HOST}/?retryWrites=true&w=majority`;

export const DB_NOTIFICATION = process.env.DB_NOTIFICATION;

//Metadata valid
export const METADATA_LIMIT_20 = 449;
export const METADATA_INVALID = 654;
export const METADATA_LIMIT_VALUE_200_CHARACTERS_RF = 450;
export const METADATA_LIMIT_KEY_30_CHARACTERS_RF = 451;
export const INVALID_SOURCE_ID_INEXISTENT_VALUE = 443;


// TYPES CHANNEL
export const CHANNEL_EMAIL = "EMAIL";
export const CHANNEL_WHATSAPP = "WHATSAPP";
export const CHANNEL_SMS = "SMS";
export const CHANNEL_PUSH = "PUSH";

// TYPES NOTIFICATION
export const COMPOUND = "COMPOUND";
export const SINGLE = "SINGLE";

/* AWS REGION */
export const REGION = 'us-east-2';

/* SQS */
export const SQS_MAIL_URL = `https://sqs.us-east-2.amazonaws.com/${process.env.SQS_ACCOUNT}/${process.env.SQS_MAIL_NAME}`;
export const SQS_WHATSAPP_URL = `https://sqs.us-east-2.amazonaws.com/${process.env.SQS_ACCOUNT}/${process.env.SQS_WHATSAPP_NAME}`;
export const SQS_SMS_URL = `https://sqs.us-east-2.amazonaws.com/${process.env.SQS_ACCOUNT}/${process.env.SQS_SMS_NAME}`;
export const SQS_PUSH_URL = `https://sqs.us-east-2.amazonaws.com/${process.env.SQS_ACCOUNT}/${process.env.SQS_PUSH_NAME}`;

/* SCHEDUL */
export const TIME_SEND_SCHEDULE = 5;
export const MAX_ATTEMPTS = 5

/* VALIDATION LENGTH */
export const MAX_BODY_SIZE_EMAIL = 19922944;
export const MAX_BODY_SIZE_SMS = 160;
export const MAX_BODY_SIZE_PUSH_NOTIFICATION = 4096;
export const MAX_BODY_SIZE_WHATSAPP = 4096;
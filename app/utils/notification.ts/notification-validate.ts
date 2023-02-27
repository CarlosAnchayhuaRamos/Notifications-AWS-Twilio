import {
  METADATA_INVALID
} from "../constants";
import { MetadataUtil } from "../metadata/metadata-util";
import { ReceiptNotification } from "../../model/dto/receiptNotificationDTO";
import { To } from "../../model/dto/toDTO";

export class ChargeValidation {
  public static validateNotification(
    receiptNotification: ReceiptNotification
  ) {
    this.validateTo(receiptNotification?.data?.to);
  }
  private static validateTo(To: To[]) {
    try {
      for (const key in To) {
        this.validateMetaData(To[key].metadata)
      }
    } catch (e) {
      throw new Error(METADATA_INVALID.toString());
    }
  }

  private static validateMetaData(metadata: Map<string, Object>) {
    try {
      const metadataValidation: Map<number, string> =
        MetadataUtil.validateMetadata(metadata);
      if (metadataValidation != null) {
        let codeResponseValidate: number = null;
        let data: string = null;
        for (var [key, value] of metadataValidation) {
          codeResponseValidate = key;
          data = value.toString();
        }
        throw new Error(codeResponseValidate.toString() + "value: " + data);
      }
    } catch (e) {
      throw new Error(METADATA_INVALID.toString());
    }
  }
}

import {
  METADATA_INVALID,
  METADATA_LIMIT_20,
  METADATA_LIMIT_KEY_30_CHARACTERS_RF,
  METADATA_LIMIT_VALUE_200_CHARACTERS_RF,
} from "../constants";

export class MetadataUtil {
  private static validateMetadataKey(metadata: Map<string, object>): string {
    let val: string = null;

    for (const [key, value] of Object.entries(metadata)) {
      if (key.length > 30) {
        val = key;
        break;
      }
    }
    return val;
  }

  private static validateMetadataValue(metadata: Map<string, object>): string {
    let val: string = null;

    for (const [key, value] of Object.entries(metadata)) {
      if (value.toString().length > 200) {
        val = value.toString();
        break;
      }
    }
    return val;
  }

  public static validateMetadata(
    metadata: Map<string, object>
  ): Map<number, string> {
    return this.validateMetadataRequired(metadata, false);
  }

  public static validateMetadataRequired(
    metadata: Map<string, object>,
    isRequired: boolean
  ): Map<number, string> {
    if (!isRequired && metadata == null) {
      return null;
    }

    let result: Map<number, string> = null;
    const size: number = Object.keys(metadata).length || 0;

    if (isRequired && size == 0) {
      result = new Map();
      result.set(METADATA_INVALID, null);
      return result;
    }

    if (size > 20) {
      result = new Map();
      result.set(METADATA_LIMIT_20, null);
      return result;
    }

    const key: string = this.validateMetadataKey(metadata);
    if (key != null) {
      result = new Map();
      result.set(METADATA_LIMIT_KEY_30_CHARACTERS_RF, key);
      return result;
    }

    const value: string = this.validateMetadataValue(metadata);
    if (value != null) {
      result = new Map();
      result.set(METADATA_LIMIT_VALUE_200_CHARACTERS_RF, value);
      return result;
    }

    return result;
  }
}

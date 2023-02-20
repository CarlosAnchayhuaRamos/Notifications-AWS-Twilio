import { IsArray, MinLength, IsOptional } from "class-validator";

export class To {

  @MinLength(5, {
    each: true,
    message: "To is too short",
  })
  @IsArray()
  @IsOptional()
  to: string;

  metadata: Record<string, unknown>;

  constructor(
    to: string,
    metadata: Record<string, unknown>,
  ) {
    this.to = to;
    this.metadata = metadata;
  }
}

export const mapperTo = (mapper: object): To => {
  return new To(
    mapper["to"],
    mapper["metadata"],
  );
};

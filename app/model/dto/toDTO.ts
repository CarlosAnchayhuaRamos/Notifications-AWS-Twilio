import { IsArray, MinLength, IsOptional } from "class-validator";

export class To {

  @MinLength(5, {
    each: true,
    message: "To is too short",
  })
  @IsArray()
  @IsOptional()
  to: string;

  metadata: Map<string, Object>;

  constructor(
    to: string,
    metadata: Map<string, Object>,
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

import { IsString, IsArray, MinLength, MaxLength, IsOptional } from "class-validator";
import { To, mapperTo } from "./toDTO";

interface RecipientMetadata {
  name: string;
  last_name: string;
}

interface Recipient {
  to: string;
  metadata: RecipientMetadata;
}

export class Data {
  @IsString()
  @MinLength(3, {
    message: "Title is too short",
  })
  @MaxLength(55, {
    message: "Title is too long",
  })
  @IsOptional()
  title: string;

  @IsString()
  @MinLength(5, {
    message: "Body is too short",
  })
  body: string;

  @MinLength(5, {
    message: "From is too short",
  })
  @MaxLength(500, {
    message: "From is too long",
  })
  @IsOptional()
  from: string;

  to: any[];

  @IsString()
  @MinLength(5, {
    message: "Image is too short",
  })
  @MaxLength(500, {
    message: "Image is too long",
  })
  @IsOptional()
  image: string;

  constructor(
    title: string,
    body: string,
    from: string,
    to: any[],
    image: string
  ) {
    this.title = title;
    this.body = body;
    this.from = from;
    this.to = to;
    this.image = image;
  }
}

export const mapperData = (mapper: object): Data => {
  return new Data(
    mapper["title"],
    mapper["body"],
    mapper["from"],
    mapper["to"] ? mapper["to"].map((model) => mapperTo(model)) : [],
    mapper["image"]
  );
};

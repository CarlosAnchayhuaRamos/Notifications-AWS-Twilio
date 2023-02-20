import {
  IsOptional,
} from "class-validator";

export class Send {
  @IsOptional()
  scheduling: Boolean;

  @IsOptional()
  date: Date;
  constructor(
    scheduling: Boolean,
    date: Date,
  ) {
    this.scheduling = scheduling;
    this.date = date;
  }
}

export const mapperSend = (mapper: object): Send => {
  return new Send(
    mapper["scheduling"],
    mapper["date"]);
};

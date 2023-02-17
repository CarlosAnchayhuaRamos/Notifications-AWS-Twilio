import {
  IsOptional,
} from "class-validator";

export class Send {

  @IsOptional()
  date: Date;
  constructor(
    date: Date,
  ) {
    this.date = date;
  }
}

export const mapperSend = (mapper: object): Send => {
  return new Send(mapper["date"]);
};

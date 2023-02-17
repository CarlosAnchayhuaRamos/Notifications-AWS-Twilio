export class send {
  scheduling: boolean;
  date: Date;

  constructor(
    scheduling: boolean,
    date: Date,
  ) {
    this.scheduling = scheduling;
    this.date = date;
  }
}

export class data {
  title: string;
  body: string;
  from: string;
  to: string;
  image: string;

  constructor(
    title: string,
    body: string,
    from: string,
    to: string,
    image: string,
  ) {
    this.title = title;
    this.body = body;
    this.from = from;
    this.to = to;
    this.image = image;
  }
}

export class Notification {
  channel: string;
    type: string;
    send: send;
    data: data;

  constructor(
    channel: string,
    type: string,
    send: send,
    data: data,
  ) {
    this.channel = channel;
    this.type = type;
    this.send = send;
    this.data = data;
  }
}
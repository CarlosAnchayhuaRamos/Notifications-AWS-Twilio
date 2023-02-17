import { MessageUtil } from "../utils/message";
import { Service } from "typedi";
import { SchedulService } from "../service/notifications.service";

@Service()
export class SchedulController {
  constructor(private service: SchedulService) {}

  async schedul() {
    try {
      const response = await this.service.findNotifications();
      return MessageUtil.success(response);

    } catch (error) {
      console.error(error);
      return MessageUtil.error(error.code, error.message);
    }
  }
}

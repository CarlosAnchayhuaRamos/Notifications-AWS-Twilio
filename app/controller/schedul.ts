import { MessageUtil } from "../utils/message";
import { Service } from "typedi";
import { SchedulService } from "../service/notifications.service";

// Use the @Service decorator from typedi to mark this class as a service
@Service()
export class SchedulController {
  constructor(private service: SchedulService) {}

  // Define an async function called "schedul"
  async schedul() {
    try {
      // Call the "findNotifications" method on the injected service
      const response = await this.service.findNotifications();
      // Use the "success" method of the MessageUtil class to return a success message with the response
      return MessageUtil.success(response);

    } catch (error) {
      // Log the error to the console
      console.error(error);
      // Use the "error" method of the MessageUtil class to return an error message with the error code and message
      return MessageUtil.error(error.code, error.message);
    }
  }
}

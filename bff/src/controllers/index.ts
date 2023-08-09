import { CustomerResponseType } from "@/utils/prerequest";

type ErrorInfo = {
  success: boolean;
  msg?: string;
}
 
class BaseController {
  protected validateStatus(res: CustomerResponseType[]): ErrorInfo {
    return {
      success: false,
      msg: ''
    }
  }
}

export default BaseController;
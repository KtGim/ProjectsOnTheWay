import BaseService from './index';
class SecondService extends BaseService {
  
  constructor() {
    super()
  }

  getData() {
    return Promise.resolve('secondInner');
  }

}

export default SecondService;
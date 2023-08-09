// 依照需求更改，添加适当地 state 数据
import { modelsContainer } from 'creams-layout';
import FieldModel from 'creams-setting/pages/template/field/model';
import FormTemplateModel from 'creams-setting/pages/template/formTemplate/model';
import ExpireRemindModel from 'creams-setting/pages/contractManage/expireRemind/model';
import Remark from 'creams-setting/pages/invoice/remark/model';
import ReviewProcessConfig from 'creams-setting/models/reviewProcess/config';
import ProcessPage from 'creams-setting/models/reviewProcess/process';

const actions = {
    field: new FieldModel(),
    formTemplate: new FormTemplateModel(),
    expireRemind: new ExpireRemindModel(),
    remarkPage: new Remark(),
    reviewProcessConfigPage: new ReviewProcessConfig(),
    processPage: new ProcessPage()
};

modelsContainer.put(actions);
export default actions;

// page models
import { IState as AdminState } from 'creams-setting/pages/authority/admin/model/types';
import { IState as RoleState } from 'creams-setting/pages/authority/role/model/types';
import { IState as StaffState } from 'creams-setting/pages/authority/staff/model/types';
import { ProjectModel, AliyunStsFeignResponse } from '@/services/interfaces';
import { IState as FlowAccountState } from 'creams-setting/pages/account/flowAccount/model/types';
import { IState as accountingSubjectState } from 'creams-setting/models/voucherSetting/AccountingSubject/types';
import { IState as voucherSubjectState } from 'creams-setting/models/voucherSetting/VoucherSubject/types';
import { IState as voucherSettingState } from 'creams-setting/models/voucherSetting/VoucherRuleSetting/types';
import { IState as voucherNumRuleState } from 'creams-setting/models/voucherSetting/VoucherNumRule/types';

import { IState as RevenueState } from 'creams-setting/pages/account/revenue/model/types';
import { IState as TaxState } from 'creams-setting/pages/invoice/taxRate/model/types';
import { IState as configureModalState } from 'creams-setting/pages/tenant/modules/configure/model/types';
import { IState as projectsBindingState } from 'creams-setting/pages/tenant/modules/projectsBinding/model/types';
import { IState as urlBindingState } from 'creams-setting/pages/tenant/modules/urlBinding/model/types';
import { IState as deviceTypeState } from 'creams-setting/pages/property/deviceType/model/types';
import { IState as commodityState } from 'creams-setting/pages/invoice/commodityName/model/types';
import { IState as sellerState } from 'creams-setting/pages/invoice/sellerInfo/model/types';
import { IState as SetConfigState } from 'creams-setting/pages/custom/setConfig/model/types';
import { IState as FieldState } from 'creams-setting/pages/template/field/model/types';
import { IState as FormTemplateState } from 'creams-setting/pages/template/formTemplate/model/types';
import { IState as ExpireRemindState } from 'creams-setting/pages/contractManage/expireRemind/model/types';
import { IState as Remark } from 'creams-setting/pages/invoice/remark/model/types';
import { IState as ReviewProcessConfigPage } from 'creams-setting/models/reviewProcess/config/types';
import { IState as ProcessPage } from 'creams-setting/models/reviewProcess/process/types';

// global model
import { IState as CategoryModel } from 'creams-setting/models/customModel/categoryModel';
import { IState as accountSetting } from 'creams-setting/models/accountSetting/types';

export interface State {
    tagModel: any;
    sellerModal: sellerState;
    categoryModel: CategoryModel;
    commodityModal: commodityState;
    taxModal: TaxState;
    deviceTypeModel: deviceTypeState;
    staff: StaffState;
    configureModal: configureModalState;
    projectsBindingModal: projectsBindingState;
    urlBindingModal: urlBindingState;
    admin: AdminState;
    role: RoleState;
    tenant: {
        projectsList: ProjectModel[];
        modelEditData: any;
        INDEX_CAROUSEL: any[]; // 首页轮播
        NEWS: any[]; // 新闻动态
        PROPERTY_CONTACT: any[]; // 物业服务
        TICKET_SERVICE_WAY: any[]; // 工单服务
        ENTERPRISE_SERVICE: any[]; // 企业信息
        ENTERPRISE_SERVICE_CAROUSEL: any[]; // 企业轮播图
        ACTIVITY: any[]; // 活动配置
        POLICY_DECLARATION: any[]; // 政府申报
        ossUploadStsToken: AliyunStsFeignResponse;
    };
    flowAccountModel: FlowAccountState;
    revenueModal: RevenueState;
    accountSetting: accountSetting;
    accountingSubject: accountingSubjectState;
    voucherSubject: voucherSubjectState;
    voucherNumRule: voucherNumRuleState;
    voucherRuleSetting: voucherSettingState;
    setConfig: SetConfigState;
    commodityModalq: any;
    field: FieldState;
    formTemplate: FormTemplateState;
    expireRemind: ExpireRemindState;
    remarkPage: Remark;
    reviewProcessConfigPage: ReviewProcessConfigPage;
    processPage: ProcessPage
}

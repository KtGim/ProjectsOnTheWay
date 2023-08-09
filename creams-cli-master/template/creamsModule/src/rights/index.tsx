import { Rights } from 'creams-layout';
import { RightType as rightTypes } from '@/constants';

const rights: Rights = {
    setting_tenant_companyInfo: () => import('./companyInfo'),
    [rightTypes.role]: () => import('./role'),
    [rightTypes.staff]: () => import('./staff'),
};

export default rights;

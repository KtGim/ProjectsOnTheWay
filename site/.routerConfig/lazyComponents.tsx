import {lazy} from 'react';
import { componentsPath, ComponentsProps } from './common';

const components: ComponentsProps = {
    A: lazy(() => import((`${componentsPath}/business/A/index.tsx`)))
};

export default components;

    import {lazy} from 'react';
    import { ComponentsProps } from './common';

    const components: ComponentsProps = {
        
    A: lazy(() => import(('../../docs/business/A/Demo.md')))
    ,
    B: lazy(() => import(('../../docs/business/B/Demo.md')))
    
    };

    export default components;
    
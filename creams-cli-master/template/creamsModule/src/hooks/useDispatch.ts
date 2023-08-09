import actions from 'creams-setting/actions';
import { useDispatch } from '@/hooks';

const useCurrentDispatch = <T extends keyof typeof actions = keyof typeof actions>() => {
    return useDispatch<Pick<typeof actions, T>>(actions);
};

export default useCurrentDispatch;

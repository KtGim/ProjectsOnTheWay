import HW from './HelloWorld.vue'

HW.install = function (Vue: any) {
    Vue.component(HW.name, HW);
};

export default HW;
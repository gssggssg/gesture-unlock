import GestureUnlock from './GestureUnlock/GestureUnlock.vue'

const install = function (Vue) {
  Vue.component('GestureUnlock', GestureUnlock);
};

export default install; // 这个方法以后再使用的时候可以被use调用

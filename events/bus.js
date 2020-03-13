export default () => {
  return {
    // 存储的事件名称以及对应的监听数组
    events: {},
    emit(event, ...args) {
      (this.events[event] || []).forEach(e => e.apply(this, args));
    },
    /**
     * 给某事件名称增加监听回调
     * @param event 事件名
     * @param callback 监听回调
     * @param once 只执行一次
     */
    on(event, callback, once) {
      if (typeof callback !== 'function') {
        throw new TypeError('请设置监听函数');
      }

      // 安排监听函数
      (this.events[event] = this.events[event] || []).push(callback);

      // 注销监听
      const unbind = () =>
        this.events[event].forEach(
          (e, i) => e === callback && this.events[event].splice(i, 1)
        );

      // 只执行一次
      if (once) {
        callback = function() {
          unbind();
          callback.apply(this, arguments);
        };
      }

      return unbind;
    },
    /**
     * 取消时间绑定
     * @param  {String} event 事件名称
     */
    off(event) {
      this.events[event].forEach((e, i) => this.events[event].splice(i, 1));
    }
  };
};

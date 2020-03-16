import useTypeof from '../asserts/typeof';

export default params => {
  if (!params.uri) throw 'Need params.uri';

  /** 事件处理队列 */
  let _events = {};

  return {
    /** ws 实例对象 */
    ws: null,

    /** 初始化连接 */
    conn() {
      if (!this.ws) {
        this.ws = new WebSocket(params.uri);
      }
      return this;
    },

    /** 对某些方法监听追加处理
     * @param {String} eventName 事件名 onmessage, ..
     * @param {Function} func
     */
    when(eventName, func) {
      if (!this.ws) return;
      if (useTypeof(func) !== 'function') throw 'func入参必须为函数';

      // 事件处理列表
      _events[eventName] = _events[eventName] || [];

      // 去重复
      this.clear(eventName, func);

      // 加入队列
      _events[eventName].push(func);

      this.ws[eventName] = async evt => {
        
        if (params.on && params.on[useTypeof(evt)]) {
          params.on[useTypeof(evt)](evt);
        }

        _events[eventName].map(f => {
          f(evt);
        });
      };
    },

    /**
     * 取消所有或者某个处理
     * @param {String} eventName 事件名 onmessage, ..
     * @param {Function} func
     */
    clear(eventName, func) {
      if (!func) _events[eventName] = [];
      else {
        _events[eventName] = _events[eventName].filter(f => {
          return f.toString() !== func.toString();
        });
      }
    },

    /** 发送消息 */
    send(msg) {
      if (!this.ws) return;
      this.ws.send(msg);
    }
  };
};

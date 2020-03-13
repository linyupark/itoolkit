/**
 * 判断设备类型
 */

const ua = navigator.userAgent.toLowerCase();

export default {
  ua,
  weixin: ~ua.indexOf('micromessenger')
}

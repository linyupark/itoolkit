
import useTypeof from '../asserts/typeof';


/**
 * 对接口返回的数据根据语意上进行结构保护处理
 * @param {Mixed} data 接口返回的数据
 * @returns {Object} 保护后的数据
 */
export default data => {
  // 没有通过 json 解析的则直接返回不做任何处理
  if (useTypeof(data) === 'string') {
    return data;
  }
  // 有聚合数据
  if (data.hasOwnProperty('data')) {
    // 对象数据
    if (useTypeof(data.data) !== 'object') {
      data.data = {};
    }
  }
  // 智能数据保护
  if (useTypeof(data) === 'object') {
    Object.keys(data).forEach(field => {
      // json
      try {
        data[field] = JSON.parse(data[field]);
      } catch (e) {
        // 不是json不做任何处理
      }
      // array
      if (/\w?List$/.test(field) && useTypeof(data[field]) !== 'array') {
        data[field] = [];
      }
      // number
      if (
        /\w?Count$|Num(ber)?/i.test(field) &&
        useTypeof(data[field]) !== 'number'
      ) {
        data[field] = Number(data[field]);
      }
      // boolean
      if (/^is\w+/.test(field) && useTypeof(data[field]) !== 'boolean') {
        data[field] = Boolean(Number(data[field]));
      }
      // string
      if (useTypeof(data[field]) === 'string') {
        // 不干净的空字符串
        if (data[field].length > 0 && data[field].trim() === '') {
          data[field] = '';
        }
        // 关键字排除
        if (data[field].trim() === 'undefined') {
          data[field] = '';
        }
        if (data[field].trim() === 'NaN') {
          data[field] = '';
        }
      }
      // keywords
      if (
        useTypeof(data[field]) === 'null' ||
        (isNaN(data[field]) && useTypeof(data[field]) === 'number') ||
        useTypeof(data[field]) === 'undefined'
      ) {
        data[field] = '';
      }
    });
  }

  return data;
}
import { utf8array2str } from '../transform/index';


/**
 * 将 https://github.com/protobufjs/protobuf.js
 * npx pbjs -t json-module -w es6 -o src/proto/proto.js  src/proto/*.proto
 * 生成出来的proto文件作为js对象带入入参数
 * @returns {Object} {encode: 加密, decode: 解密}
 */
export default protoRoot => {
  return {
    encode(data, reqType, finish = true) {
      const reqMessage = protoRoot.lookup(reqType);
      if (finish) return reqMessage.encode(reqMessage.create(data)).finish();
      return reqMessage.create(data)
    },
    decode(data, resType) {
      const resMessage = protoRoot.lookup(resType);
      const messageRootFields = resMessage.fields;

      const result = resMessage.toObject(
        resMessage.decode(new Uint8Array(data)),
        {
          // 确保 byte 格式的会转换为 base64string
          // 形式改为递归将bytes类型的手动追加一个String结尾的字段值
          // bytes: String
        }
      );
      loopMessageFields(messageRootFields, result);
      return result;
    }
  };
};

/**
 * 遍历消息字段包含 bytes 类型的增加一个字段值为 Utf8数组转换成字符串
 * @param {Array} fields 
 * @param {Object} result 
 * @param {Number} n 
 */
export function loopMessageFields(fields, result, n = 0) {
  for (let k in result) {
    if (fields && fields[k]) {
      if (fields[k].resolvedType) {
        loopMessageFields(
          fields[k].resolvedType.fields,
          result[k],
          n + 1
        );
      }
      if (fields[k].type === 'bytes') {
        result[`${k}String`] = utf8array2str(result[k]);
      }
    }
  }
}

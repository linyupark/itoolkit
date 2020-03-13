
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
        result[`${k}String`] = Utf8ArrayToStr(result[k]);
      }
    }
  }
}

/**
 * Utf8数组转换字符串
 * @param {Array} array 
 */
export function Utf8ArrayToStr(array) {
  var out, i, len, c;
  var char2, char3;
  out = '';
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        );
        break;
    }
  }

  return out;
};

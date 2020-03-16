
/**
 * Utf8数组转换字符串
 * @param {Array} array 
 */
export function utf8array2str(array) {
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


/**
 * 将blob数据流转换成array流
 * @param {Blob} blob
 **/
export const blob2buffer = blob => {
  return new Promise((rs, rj) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = () => {
      rs(reader.result);
    };
    reader.onerror = e => {
      rj(e);
    };
  });
};

// 日期格式化
export function dateFormatToStr(time){
  if(date != null){
      var date = new Date(time);
      // 获取年份
      let y = date.getFullYear();
      // 获取月份
      let m = date.getMonth() + 1;
      // 获取日
      let d = date.getDate() ;

      // 获取小时,若小于10 则在前面加0
      let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      // 获取分钟，若小于10 则在前面加0
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      // 获取秒数，若小于10 则在前面加0
      let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

      return `${y}-${m}-${d} ${hours}:${minutes}:${seconds}`;
  }
}

/**
* 正则表达式
*/
export var regEXConstant = {
  // 博客文件预览地址
  blogFilePreviewUrl: /(!\[\S*\])\(http:\/\/\S+\/file\/open\/blog\/getFilePreview\/\d+(\.\S+)\)/gm,
  // 测试图片链接
  testImagePreviewUrl: /(!\[\S*\])\(https:\/\/dummyimage\.com\/\d+x\d+\/\S+\)/gm
}

export const dataFormat = {
  dateFormatToStr,
}

/**
* 判断内容是否为空
*/
export function isEmpty(value) {
  // 判断是否为null或undefined
  if (value === null || value === undefined) {
    return true;
  }

  // 如果是字符串，去除空格后判断是否为空
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }

  // 如果是数组，判断是否为空数组
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  // 如果是对象，判断是否为空对象
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  
  // 其他情况认为不为空
  return false;
}
/**
 * 判断内容是否非空
 * @param {*} value 
 * @returns 
 */
export function isNotEmpty(value){
  return !isEmpty(value)
}
// var globalData = getApp().globalData
// const host = globalData.host
// var emojis = globalData.emojis
// var emojisEn = globalData.emojisEn

function formatTime(time) {
  const date = new Date(time)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [hour, minute, second].map(formatNumber).join(':')
}
// 获取当前日期，并将其格式化为YYYY-MM-DD
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "/";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function insertStrOnceSize(content, str, size) {
  if (content.length <= size) return content;
  return content.substring(0, size) + "\n" + insertStrOnceSize(content.substring(15, content.length), '\n', size);
}

function getContents(msg, url) {
  let contents = []
  if (url) {
    contents.push({
      type: 'text',
      text: msg + "\n" + insertStrOnceSize(url, '\n', 15)
    })
    return contents;
  }
  let arr = msg.match(/\[[^\[\]]+\]/g);
  for (let i in arr) {
    let emoji = arr[i].substring(1, arr[i].length - 1);
    let index = emojis.indexOf(emoji);
    if (index != -1) {
      let str = msg.substring(0, msg.indexOf(arr[i]));
      if (str) {
        contents.push({
          type: 'text',
          text: insertStrOnceSize(str, '\n', 15)
        })
      }
      contents.push({
        type: 'image',
        url: '/emoji/' + emojisEn.slice(index, index + 1)[0] + '.png'
      })
      msg = msg.substring(msg.indexOf(arr[i]) + arr[i].length, msg.length)
    }
  }
  if (msg) {
    contents.push({
      type: 'text',
      text: insertStrOnceSize(msg, '\n', 15)
    })
  }
  return contents
}

function getEmojiEn(emoji) {
  let index = emojis.indexOf(emoji);
  return emojisEn.slice(index, index + 1)[0];
}

function commentTimeHandle(dateStr,typ) {
  var time = dateStr;
  var type = typ
  var repTime = time.replace(/-/g, '/');//用正则兼容ios
  var targetDate = new Date(repTime);
      var year = targetDate.getFullYear();
      var month = targetDate.getMonth() + 1;
      var day = targetDate.getDate();
      var nowDate = new Date();
      var now_new = Date.parse(nowDate.toString());
      var milliseconds = 0;
      milliseconds = now_new - targetDate;
  // console.log("返回时间：" + repTime);
  var timeTamp = Date.parse(repTime);
  // console.log("返回时间戳：" + timeTamp)
  var publishTime = timeTamp / 1000,  //获取dataStr的秒数
    date = new Date(publishTime * 1000), //获取dateStr的标准格式
    // 获取date 中的 年 月 日 时 分 秒
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  // 对 月 日 时 分 秒 小于10时, 加0显示 例如: 09-09 09:01
  if (M < 10) {
    M = '0' + M;
  }
  if (D < 10) {
    D = '0' + D;
  }
  if (H < 10) {
    H = '0' + H;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }

  var nowTime = new Date().getTime() / 1000, //获取此时此刻日期的秒数
    diffValue = nowTime - publishTime,  // 获取此时 秒数 与 要处理的日期秒数 之间的差值
    diff_days = parseInt(diffValue / 86400),    // 一天86400秒 获取相差的天数 取整
    diff_hours = parseInt(diffValue / 3600),    // 一时3600秒
    diff_minutes = parseInt(diffValue / 60),
    diff_secodes = parseInt(diffValue);
    if(type == 3){
      if(diff_days <= 0){
        return "今天"+ ' ' + H +':'+m;
      }else if(diff_days > 0 && diff_days < 2){
        return "昨天" + ' ' + H +':'+m;
      }else if (year == nowDate.getFullYear()) {
        return month + '-' + day + '  ' + H +':'+m;
      } else {
        return year + '-' + month;
      }
    }
  if(type == 2){
    if(diff_days <= 0){
      return "今天";
    }else if(diff_days > 0 && diff_days < 2){
      return "昨天";
    }else if (year == nowDate.getFullYear()) {
      if(day > 9){
        return month + '/' + day;
      }else{
        return month + '/' + 0 + day;
      }
    } else {
      if(day > 9){
        return month + '/' + day;
      }else{
        return month + '/' + 0 + day;
      }
    }
  }else{
    if (diff_days > 0 && diff_days < 2) {  //相差天数 0 < diff_days < 2 时, 直接返出
      return diff_days + "天前";
    } else if (diff_days <= 0 && diff_hours > 0) {
      return diff_hours + "小时前";
    } else if (diff_hours <= 0 && diff_minutes > 0) {
      return diff_minutes + "分钟前";
    } else if (diff_secodes < 60) {
      if (diff_secodes <= 0) {
        return "刚刚";
      } else {
        return diff_secodes + "秒前";
      }
    } else if (year == nowDate.getFullYear()) {
      if(day > 9){
        return month + '-' + day;
      }else{
        return month + '-' + 0 + day;
      }
    } else {
      if(day > 9){
        return year + '-' + month + '-' + day;
      }else{
        return  year + '-' + month + '-' + 0 + day;
      }
    }
  }

}

// function getHoroscope(time) {
//   const date = new Date(time)
//   var c = ['摩羯座','水瓶座','双鱼座','白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座']
//   var month = date.getMonth() + 1;
//   var day = date.getDate();
//   var startMonth = month - (day - 14 < '865778999988'.charAt(month));
//   return c[startMonth]
// }

/**
 * 输入Unix时间戳，返回指定时间格式
 */
 function calcTimeHeader(time) {
  // 格式化传入时间
  let date = new Date(parseInt(time)),
    year = date.getUTCFullYear(),
    month = date.getUTCMonth(),
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getUTCMinutes()
  // 获取当前时间
  let currentDate = new Date(),
    currentYear = date.getUTCFullYear(),
    currentMonth = date.getUTCMonth(),
    currentDay = currentDate.getDate()
  // 计算是否是同一天
  if (currentYear == year && currentMonth == month && currentDay == day) {//同一天直接返回
    if (hour > 12) {
      return `下午 ${hour}:${minute < 10 ? '0' + minute : minute}`
    } else {
      return `上午 ${hour}:${minute < 10 ? '0' + minute : minute}`
    }
  }
  // 计算是否是昨天
  let yesterday = new Date(currentDate - 24 * 3600 * 1000)
  if (year == yesterday.getUTCFullYear() && month == yesterday.getUTCMonth && day == yesterday.getDate()) {//昨天
    return `昨天 ${hour}:${minute < 10 ? '0' + minute : minute}`
  } else {
    return `${year}-${month + 1}-${day} ${hour}:${minute < 10 ? '0' + minute : minute}`
  }
}

function add0(m){return m<10?'0'+m:m }
function format(shijianchuo){
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

/*函数节流*/
function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 1000 ;//间隔时间，如果interval不传，则默认300ms
  return function() {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context,arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/*函数防抖*/
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 300;//间隔时间，如果interval不传，则默认300ms
  return function() {
    clearTimeout(timer);
    var context = this;
    var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function() {
      fn.call(context,args);
    }, gapTime);
  };
}

module.exports = {
  formatTime: formatTime,
  getNowFormatDate: getNowFormatDate,
  getContents: getContents,
  getEmojiEn: getEmojiEn,
  commentTimeHandle: commentTimeHandle,
  calcTimeHeader:calcTimeHeader,
  format:format,
  throttle:throttle,
  debounce:debounce,
  // getHoroscope:getHoroscope
}

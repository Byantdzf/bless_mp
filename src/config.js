
/* ========================================================
                        小程序配置文件
======================================================== */
// 域名
var book = 'https://christ.data.ufutx.com/api',
  party = 'https://party.ufutx.com/api'

if (_NODE_) {
  var host = 'https://love.ufutx.com/api' // 线上环境
  // var host = 'http://alpha.ufutx.net/api'  // 测试环境
  // var host = 'http://al.ufutx.cn/api' // 测试环境
} else {
  // var host = 'http://app.ufutx.net/api'  // 测试环境
  // var host = 'http://h5.ufutx.net/api'  // 测试环境
  // var host = 'http://alpha.ufutx.net/api'  // 测试环境
  var host = 'https://love.ufutx.com/api' // 线上环境
    // var host = 'http://al.ufutx.cn/api' // 测试环境
    // var host = 'http://love.hankin.cn/api' // 测试环境
    // var host = 'http://beta.ufutx.net/api' // 测试环境
    // var host = 'http://10.10.10.20:84/api' // 本地环境
}

export const service = {
  // 登录接口
  login: `${host}/official/bottle/login`,
  // 发祝福
  bottle: `${host}/official/bottle`
}

export default {
  service
}

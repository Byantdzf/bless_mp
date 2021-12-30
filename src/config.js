
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
  // 主域
  host: `${host}`,
  // 登录接口
  login: `${host}/official/bottle/login`,
  // 发祝福
  bottle: `${host}/official/bottle`,
  // 祝福详情
  bottleId: `${host}/official/bottle`,
  // 祝福聊天记录
  bottleRecord: `${host}/official/bottle/record`,
  // 回复祝福
  bottleChat: `${host}/official/bottle/chat`,
  // 聊天记录最新数据
  bottleLatestData: `${host}/official/bottle/LatestData`,
  // 上传
  image_upload: `${host}/admin/upload/file/aliyun`
}

export default {
  service
}

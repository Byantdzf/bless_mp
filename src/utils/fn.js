const getElement_WH = (element) => { // 获取元素位置
  console.log(element)
  return new Promise((resolve, reject) => {
    let query = wx.createSelectorQuery()
    query.select(element).boundingClientRect((rect) => {
      if (typeof rect == 'object') {
        resolve(rect)
      } else {
        reject('TypeError')
      }
    }).exec()
  })
}
const wxPay = (wxconfig) => { // 微信支付
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: wxconfig.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: wxconfig.nonceStr, // 支付签名随机串，不长于 32 位
      package: wxconfig.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: wxconfig.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: wxconfig.paySign, // 支付签名
      success: (res) => {
        resolve(res)
      },
      fail: (res) => {
        reject('已取消支付')
      }
    })
  })
}
const callPhone = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function () {
        console.log('拨打电话成功!')
        // resolve(res)
      },
      fail: function () {
        console.log('拨打电话失败！')
        // reject('拨打电话失败')
      }
    })
  })
}
const wx_login = () => { // 微信登录
  return new Promise((resolve, reject) => {
    let codeV2 = wx.getStorageSync('code')
    // if (!codeV2) {
    //   wx.login({
    //     success: (res) => {
    //       resolve(res.code) // 返回code
    //     },
    //     fail: (res) => {
    //       reject(res)
    //     }
    //   })
    // } else {
    //   wx.checkSession({
    //     success (res) {
    //       console.log(res, 'res')
    //       if (res.errMsg == 'checkSession:ok') {
    //         resolve(codeV2) // 返回code
    //       } // session_key 未过期，并且在本生命周期一直有效
    //     },
    //     fail () { // session_key 已经失效，需要重新执行登录流程
    wx.login({
      success: (res) => {
        resolve(res.code) // 返回code
      },
      fail: (res) => {
        reject(res)
      }
    })
    //     }
    //   })
    // }
  })
}

const getsubscription = (params) => {
  // 这里的tmplId是一个数组得注意一下
  var tmplIds = params
  console.log(tmplIds)
  return new Promise((resolve, reject) => {
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log(res)
        if (res.subscriptionsSetting.itemSettings != undefined) {
          var flag = res.subscriptionsSetting.itemSettings[tmplIds[0]]
        } else {
          var flag = undefined
        }
        console.log(flag)
        if (flag == undefined) {
          wx.requestSubscribeMessage({
            tmplIds: tmplIds,
            success(res) {
              // 点击完成后就返回成功就行
              resolve(res)
            }
          })
        } else if (flag != 'accept') {
          wx.requestSubscribeMessage({
            tmplIds: tmplIds,
            success(res) {
              // 点击完成后就返回成功就行
              resolve(true)
            }
          })
        } else {
          // 直接返回true,原本以为用户选择一直同意之后，就可以一直推送，这里是一个bug
          wx.requestSubscribeMessage({
            tmplIds: tmplIds,
            success(res) {
              // 点击完成后就返回成功就行
              resolve(true)
            }
          })
        }
      }
    })
  })
}
export {getElement_WH, wxPay, callPhone, wx_login, getsubscription}

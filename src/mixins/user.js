import wepy from 'wepy'
import { service } from '../config.js'

export default class userMixin extends wepy.mixin {
  /* ============= 工具方法（mixins没法复写，就再写一遍了） ============= */
  isFunction(item) {
    return typeof item === 'function'
  }

  // 进行微信登陆
  $doLogin() {
    wepy.login({
      success: (res) => {
        console.log('wepy.login.success:', res)
        this.$post({ url: service.login, data: {code: res.code} }, {
          success: ({code, data}) => {
            wx.setStorageSync('marriage', data.marriage)
            wx.setStorageSync('token', data.token)
            wx.setStorageSync('openid', data.openid)
            // if(!data.token){
            //   wx.setStorageSync('jump', '/' + getCurrentPages()[0].__route__)
            // }
          }
        })
      },
      fail: (res) => {
        console.log('wepy.login.fail:', res)
      }
    })
  }

  // set Code
  $setCode() {
    wepy.login({
      success: (res) => {
        console.log('wepy.login.success:', res)
        wx.setStorageSync('code', res.code)
      },
      fail: (res) => {
        console.log('wepy.login.fail:', res)
      }
    })
  }

  $getSetting() {
    wepy.getSetting({
      success: (res) => {
      },
      fail: (res) => {

      }
    })
  }
  // get code
  $getCode() {
    var code = wx.getStorageSync('code');
    if (!code) {
      this.$setCode()
    }
    var code = wx.getStorageSync('code');
    return code
  }

  $getUser() {
    var user = wx.getStorageSync('user')

    // 不重复获取用户信息
    if (!user ||  !user.nickName) {
      wepy.getUserProfile({
        desc: '用于完善资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          console.log('wepy.getUserProfile.success:', res)
          // 缓存用户信息
          wx.setStorageSync('user', res.userInfo)
        },
        fail: (res) => {
        }
      })
    }
    return user
  }

  /* ========================== 用户方法 ========================== */
  // 获取用户信息
  $getUserProfile(callback) {
    // 顶级容错
    if (!this.$parent || !this.$parent.$updateGlobalData) return
    // 取缓存信息
    const user = this.$parent.$updateGlobalData('user')
    // 不重复获取用户信息
    if (user && user.nickName) {
      this.isFunction(callback) && callback(user)
      this.$apply()
      return user
    }
    // 首次获取用户信息
    this.$login(() => {
      // 再获取用户信息
      this._wxUserInfo(callback)
    })
  }

  // 进行微信登陆
  $login(success = () => {}, noAutoLogin) {
    // 先登录
    wepy.login({
      success: (res) => {
        console.log('wepy.login.success:', res)

        // 如果不需要自动登录，就return
        if (noAutoLogin) {
          // 串行回调
          this.isFunction(success) && success(res)
          this.$apply()
          return
        }

        // 串行回调
        this.isFunction(success) && success(res)
        this.$apply()
      },
      fail: (res) => {
        console.log('wepy.login.fail:', res)
      }
    })
  }

  /* ========================= 其他方法 ========================= */
  // 获取用户公开信息（微信）
  _wxUserInfo(callback) {
    wepy.getUserProfile({
      success: (res) => {
        console.log('wepy.getUserProfile.success:', res)
        // 缓存用户信息
        const user = this.$parent.$updateGlobalData('user', res.userInfo)

        this.isFunction(callback) && callback(user)
        this.$apply()
      },
      fail: (res) => {
        console.log('wepy.getUserProfile.fail:', res)
        // 用户拒绝授权:填充默认数据
        const user = this.$parent.$updateGlobalData('user', {
          nickName: '未授权',
          avatarUrl: '/images/icon/icon-avatar@2x.png'
        })

        // 串行回调
        this.isFunction(callback) && callback(user)
        this.$apply()

        // 尝试授权
        this._wxAuthModal(callback)
      }
    })
  }

  // 提示用户开启授权
  _wxAuthModal(callback) {
    // 先判断是否支持开启授权页的API
    wx.openSetting && wx.showModal({
      title: '授权提示',
      content: 'BookMall希望获得以下权限：\n · 获取您的公开信息（昵称、头像等）',
      confirmText: '去授权',
      cancelText: '先不授权',
      success: (res) => {
        if (res.confirm) {
          console.log('_wxAuthModal.showModal: 用户点击确定', res)
          this._wxOpenSetting(callback)
        }
      }
    })
  }

  // 打开授权页
  _wxOpenSetting(callback) {
    wx.openSetting && wx.openSetting({
      success: ({authSetting}) => {
        console.log('wx.openSetting.success', authSetting)
        if (authSetting['scope.userInfo']) {
          // 用户打开设置，重新获取信息
          this._wxUserInfo(callback)
        }
      }
    })
  }
}

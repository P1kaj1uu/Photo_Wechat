// pages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowVerify: false,
    loginForm: {
      username: '',
      password: '',
    },
    registerForm: {
      username: '',
      password: '',
      aginpassword: '',
    },
    currentIndex: 1, // 1是登录，0是注册
  },
  // 滑块拼图验证成功
  verifySuccess() {
    let that = this;
    let user = {
      id: Math.round(Math.random() * 9999) + 1,
      role: '学生',
      name: null,
      username: this.data.registerForm.username,
      password: this.data.registerForm.password,
      info: null,
      photoNumber: null,
      isStuIdentify: 0,
      isPhoIdentify: 0,
      stuNumber: null,
    }
    wx.request({
      url: app.globalData.siteBaseUrl + '/user/add',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(user),
      success: function (res) {
        console.log('注册--->', res)
        if (res.data.code !== 200) {
          wx.showToast({
            title: '注册失败，用户名重复',
            icon: 'none',
            duration: 2000,
          })
          return;
        } else {
          wx.showToast({
            title: '注册成功',
            icon: 'none',
            duration: 2000,
          })
          that.setData({
            isShowVerify: false,
            currentIndex: 1,
            registerForm: {
              username: '',
              password: '',
              aginpassword: '',
            }
          })
        }
      },
    })
  },
  // 滑块拼图验证失败
  verifyError() {
    wx.showToast({
      title: '验证失败',
      icon: 'none',
      duration: 1500,
    })
  },
  // 登陆注册导航卡片切换
  toggleLogin(e) {
    let index = e.currentTarget.dataset.code;
    this.setData({
      currentIndex: index
    })
    if (index == 0) {
      this.setData({
        loginForm: {
          username: '',
          password: '',
        }
      })
    } else {
      this.setData({
        registerForm: {
          username: '',
          password: '',
          aginpassword: '',
        }
      })
    }
  },
  changeValueHandle(e) {
    // 表单对应类型
    let type = e.target.dataset.type;
    // 表单输入框中的值
    let value = e.detail;
    switch (type) {
      case '登录用户名':
        this.setData({
          loginForm: {
            username: value,
            password: this.data.loginForm.password,
          }
        })
        break;
      case '登录密码':
        this.setData({
          loginForm: {
            username: this.data.loginForm.username,
            password: value,
          }
        })
        break;
      case '注册用户名':
        this.setData({
          registerForm: {
            username: value,
            password: this.data.registerForm.password,
            aginpassword: this.data.registerForm.aginpassword,
          }
        })
        break;
      case '注册密码':
        this.setData({
          registerForm: {
            username: this.data.registerForm.username,
            password: value,
            aginpassword: this.data.registerForm.aginpassword,
          }
        })
        break;
      case '注册确认密码':
        this.setData({
          registerForm: {
            username: this.data.registerForm.username,
            password: this.data.registerForm.password,
            aginpassword: value,
          }
        })
        break;
      default:
        break;
    }
  },
  // 点击登录或注册按钮时
  loginRegister() {
    let index = this.data.currentIndex;
    // 登录
    if (index == 1) {
      let flag = Boolean(this.data.loginForm.username.trim()) && Boolean(this.data.loginForm.password.trim());
      if (!flag) {
        wx.showToast({
          title: '请先填写必填项',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
      wx.request({
        url: app.globalData.siteBaseUrl + '/user/login',
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(this.data.loginForm),
        success: function (res) {
          console.log('登录--->', res)
          if (res.data.code !== 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
            })
            return;
          } else {
            wx.setStorageSync('userInfo', res.data.data);
            wx.setStorageSync('userAvatar', null);
            wx.showToast({
              title: '登录成功',
              icon: 'none',
              duration: 2000,
            })
            wx.switchTab({
              url: '../home/home',
            })
          }
        }
      })
    } else {
      // 注册
      let flag = Boolean(this.data.registerForm.username.trim()) && Boolean(this.data.registerForm.password.trim()) && Boolean(this.data.registerForm.aginpassword.trim());
      if (!flag) {
        wx.showToast({
          title: '请先填写必填项',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
      if (this.data.registerForm.password !== this.data.registerForm.aginpassword) {
        wx.showToast({
          title: '两次密码不一致',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
      // 弹出滑动拼图验证
      this.setData({
        isShowVerify: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
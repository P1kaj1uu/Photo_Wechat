// packageA/pages/myInfo/myInfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    isShowPassword: false, // 修改密码弹窗
    password: '',
    isShowInfo: false, //修改资料弹窗
    name: '',
    info: ''
  },
  async sleep(t) {
    return new Promise((resolve) => setTimeout(resolve, t));
  },
  avatarHandle() {
    let avatarList = ['../../static/images/avatar1.jpg', '../../static/images/avatar2.jpg', '../../static/images/avatar3.jpg', '../../static/images/avatar4.jpg', '../../static/images/avatar5.jpg', '../../static/images/avatar6.jpg'];
    let randomAvatar = avatarList[Math.floor(Math.random() * avatarList.length)];
    wx.setStorageSync('userAvatar', randomAvatar);
    wx.showToast({
      title: "设置随机头像成功",
      icon: 'none',
      duration: 2000,
    })
  },
  passwordHandle() {
    this.setData({
      isShowPassword: true
    })
  },
  infoHandle() {
    this.setData({
      isShowInfo: true
    })
  },
  // 确定修改资料
  okInfo() {
    let that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/user/editInfo',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-Token': this.data.userInfo.token
      },
      data: JSON.stringify({
        id: this.data.userInfo.id,
        name: this.data.name,
        info: this.data.info
      }),
      success: function(res) {
        console.log('修改资料--->', res)
        if (res.data.code === 401) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
          wx.setStorageSync('userInfo', null);
          wx.navigateTo({
            url: '../../../pages/login/login',
          })
          return;
        }
        if (res.data.code !== 200) {
          wx.showToast({
            title: '修改资料失败',
            icon: 'none',
            duration: 2000,
          })
          that.setData({
            name: '',
            info: '',
            isShowInfo: false
          })
          return;
        } else {
          wx.showToast({
            title: '修改资料成功',
            icon: 'none',
            duration: 2000,
          })
          that.setData({
            name: '',
            info: '',
            isShowInfo: false
          })
          that.getUserInfo();
        }
      }
    })
  },
  // 取消修改资料
  closeInfo() {
    this.setData({
      name: '',
      info: '',
      isShowInfo: false
    })
  },
  // 退出登录
  logoutHandle() {
    wx.showToast({
      title: '退出成功',
      icon: 'none',
      duration: 2000,
    })
    wx.setStorageSync('userInfo', null);
    wx.setStorageSync('userAvatar', null);
    wx.navigateTo({
      url: '../../../pages/login/login',
    })
  },
  changeValueHandle(e) {
    let type = e.target.dataset.type;
    let value = e.detail;
    switch (type) {
      case '新密码':
        this.setData({
          password: value
        })
        break;
      case '新名称':
        this.setData({
          name: value
        })
        break;
      case '新简介':
        this.setData({
          info: value
        })
        break;
      default:
        break;
    }
  },
  onClose() {
    this.setData({
      isShowInfo: false,
      isShowPassword: false,
      name: '',
      info: '',
      password: ''
    })
  },
  // 确认修改密码
  changePassword() {
    if (!this.data.password.trim()) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    wx.request({
      url: app.globalData.siteBaseUrl + '/user/editPassword',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-Token': this.data.userInfo.token
      },
      data: JSON.stringify({
        id: this.data.userInfo.id,
        password: this.data.password
      }),
      success: function(res) {
        console.log('修改密码--->', res)
        if (res.data.code === 401) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
          wx.setStorageSync('userInfo', null);
          wx.navigateTo({
            url: '../../../pages/login/login',
          })
          return;
        }
        if (res.data.code !== 200) {
          wx.showToast({
            title: '修改密码失败',
            icon: 'none',
            duration: 2000,
          })
          return;
        } else {
          wx.setStorageSync('userInfo', null);
          wx.showToast({
            title: '修改密码成功',
            icon: 'none',
            duration: 2000,
          })
          wx.navigateTo({
            url: '../../../pages/login/login',
          })
        }
      }
    })
  },
  // 获取当前用户信息
  getUserInfo() {
    let that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/user/find',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'X-Token': this.data.userInfo.token
      },
      data: {
        "userId": this.data.userInfo.id
      },
      success: function(res) {
        console.log('个人资料--->', res)
        if (res.data.code === 401) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
          wx.setStorageSync('userInfo', null);
          wx.navigateTo({
            url: '../../../pages/login/login',
          })
          return;
        }
        if (res.data.code === 200) {
          let user = res.data.data;
          user.token = that.data.userInfo.token;
          wx.setStorageSync('userInfo', user);
          that.sleep(1000).then(() => {
            that.onShow();
          }, 1000)
        }
      }
    })
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
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
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
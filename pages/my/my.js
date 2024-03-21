var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userAvatar: null,
    isShowStu: false,
    isShowPho: false,
    stuId: '',
    currentTitle: ''
  },
  // 跳转查看个人资料
  viewUserInfo() {
    wx.navigateTo({
      url: '../../packageA/pages/myInfo/myInfo',
    })
  },
  // 跳转我的订单
  getPurchasedGoods() {
    wx.navigateTo({
      url: '../../packageA/pages/myPurchase/myPurchase',
    })
  },
  // 跳转我的发布
  getMyGoods() {
    wx.navigateTo({
      url: '../../packageA/pages/myPublish/myPublish',
    })
  },
  onClose() {
    this.setData({
      stuId: '',
      isShowStu: false
    })
  },
  checkStu(e) {
    let title = e.currentTarget.dataset.curtitle;
    this.setData({
      currentTitle: title
    })
    if (title === '学生' && this.data.userInfo.isStuIdentify === 1) {
      wx.showToast({
        title: "已验证学生身份",
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    if (title === '摄影师' && this.data.userInfo.isPhoIdentify === 1) {
      wx.showToast({
        title: "已认证摄影师身份",
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    this.setData({
      isShowStu: true
    })
  },
  changeStuId(e) {
    this.setData({
      stuId: e.detail
    })
  },
  // 验证学生信息/摄影师
  checkStuInfo() {
    let that = this;
    if (!that.data.stuId.trim()) {
      wx.showToast({
        title: "请输入内容",
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    let check = {
      id: Math.round(Math.random() * 9999) + 1,
      username: that.data.userInfo.username,
      isPass: 1,
      content: that.data.stuId.trim(),
      type: that.data.currentTitle === '学生' ? 1 : 2,
      userId: that.data.userInfo.id,
    }
    wx.request({
      url: app.globalData.siteBaseUrl + '/check/add',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: JSON.stringify(check),
      success: function(res) {
        console.log('新增审核--->', res)
        if (res.data.code === 401) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
          wx.setStorageSync('userInfo', null);
          wx.navigateTo({
            url: '../login/login',
          })
          return;
        }
        that.setData({
          stuId: '',
          isShowStu: false
        })
        if (res.data.code !== 200) {
          wx.showToast({
            title: "认证失败",
            icon: 'none',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: "已提交审核",
            icon: 'none',
            duration: 2000,
          })
        }
      },
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
      userAvatar: wx.getStorageSync('userAvatar'),
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
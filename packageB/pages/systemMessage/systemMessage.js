// packageB/pages/systemMessage/systemMessage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    systemMessageList: []
  },
  // 获取当前用户下的系统消息
  getUserSysMessage() {
    let that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/message/find',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: {
        "userId": that.data.userInfo.id
      },
      success: function (res) {
        console.log('当前用户的系统消息--->', res)
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
        that.setData({
          systemMessageList: res.data.data
        })
      }
    })
  },
  // 删除系统消息
  deleteHandle(e) {
    let that = this;
    let messageId = e.currentTarget.dataset.messageid;
    wx.request({
      url: app.globalData.siteBaseUrl + '/message/delete?messageId=' + messageId,
      method: 'DELETE',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      success: function (res) {
        console.log('删除系统消息--->', res)
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
            title: "删除系统消息失败",
            icon: 'none',
            duration: 2000,
          })
          return;
        } else {
          wx.showToast({
            title: "删除系统消息成功",
            icon: 'none',
            duration: 2000,
          })
          that.getUserSysMessage();
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
    this.getUserSysMessage();
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
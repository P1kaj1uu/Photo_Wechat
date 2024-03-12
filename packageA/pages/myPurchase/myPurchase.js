// packageA/pages/myPurchase/myPurchase.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    purchaseGoodsList: [],
    pageNum: 1,
    pageSize: 100
  },
  // 删除订单
  deteleFn(e) {
    let that = this;
    let recordId = e.currentTarget.dataset.recordid;
    wx.request({
      url: app.globalData.siteBaseUrl + '/record/delete?recordId=' + recordId,
      method: 'DELETE',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      success: function(res) {
        console.log('删除订单--->', res)
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
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000,
        })
        that.getUserPurchase();
      }
    })
  },
  // 获取当前用户的订单
  getUserPurchase() {
    let that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/record/find',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: {
        "userId": that.data.userInfo.id,
        "pageNum": that.data.pageNum,
        "pageSize": that.data.pageSize
      },
      success: function(res) {
        console.log('我的订单--->', res)
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
          purchaseGoodsList: res.data.data.list
        })
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
    this.getUserPurchase();
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
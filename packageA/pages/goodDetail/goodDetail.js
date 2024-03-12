// packageA/pages/goodDetail/goodDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    goodsId: 0,
    currentGoodsList: []
  },
  // 获取当前约拍商品详情
  getDetails() {
    let that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/goods/current',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: {
        "goodsId": that.data.goodsId
      },
      success: function(res) {
        console.log('约拍商品详情--->', res)
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
          currentGoodsList: res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.setData({
      goodsId: Number(options.goodsId)
    })
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
    this.getDetails();
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
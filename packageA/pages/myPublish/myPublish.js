// packageA/pages/myPublish/myPublish.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    authorGoodsList: []
  },
  // 跳转详情
  toDetailFn(e) {
    let id = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodsId=' + id
    });
  },
  // 下架
  deteleFn(e) {
    let that = this;
    let goodsId = e.currentTarget.dataset.goodsid;
    wx.request({
      url: app.globalData.siteBaseUrl + '/goods/delete?goodsId=' + goodsId,
      method: 'DELETE',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      success: function(res) {
        console.log('下架约拍--->', res)
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
          title: '下架成功',
          icon: 'none',
          duration: 2000,
        })
        that.getMyPublish();
      }
    })
  },
  // 获取我的发布
  getMyPublish() {
    let that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/goods/find',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: {
        "userId": that.data.userInfo.id
      },
      success: function(res) {
        console.log('我的发布--->', res)
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
          authorGoodsList: res.data.data
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
    this.getMyPublish();
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
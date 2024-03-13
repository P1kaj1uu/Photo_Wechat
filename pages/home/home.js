// pages/home/home.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[
      { "id": 1, "bannerName": "约拍1", "imgUrl": "/images/banner01.jpg", "clickUrl": "", "seq": 1 },
      { "id": 2, "bannerName": "约拍2", "imgUrl": "/images/banner02.jpg", "clickUrl": "", "seq": 2 }, 
      { "id": 3, "bannerName": "约拍3", "imgUrl": "/images/banner03.jpg", "clickUrl": null, "seq": 3 }
    ],                                 
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodSearchName: '',
    userInfo: null,
    goodsList: [],
    pageNum: 1,
    pageSize: 100,
  },
  toSearch(e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      goodSearchName: value
    })
    if (!value) {
      // 输入框值为空时，查询全部
      that.getAllGoods();
    } else {
      // 模糊查询
      wx.request({
        url: app.globalData.siteBaseUrl + '/goods/wx',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'X-Token': that.data.userInfo.token
        },
        data: {
          "title": that.data.goodSearchName
        },
        success: function(res) {
          console.log('模糊查询商品--->', res)
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
          let list = res.data.data;
          list.forEach(item => {
            item.avatar = '../../static' + item.avatar
          })
          that.setData({
            goodsList: list
          })
        },
      })
    }
  },
  // 查询全部商品
  getAllGoods() {
    let that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/goods/list',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: {
        "pageNum": that.data.pageNum,
        "pageSize": that.data.pageSize
      },
      success: function(res) {
        console.log('获取全部商品--->', res)
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
        let list = res.data.data.list;
        list.forEach(item => {
          item.avatar = '../../static' + item.avatar
        })
        that.setData({
          goodsList: list
        })
      }
    })
  },
  // 前往约拍商品详情页
  goToDetail(e) {
    let id = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../../packageA/pages/goodDetail/goodDetail?goodsId=' + id
    });
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
    this.getAllGoods();
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
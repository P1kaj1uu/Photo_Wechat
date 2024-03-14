// packageB/pages/chatMessage/chatMessage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    otherId: 0,
    chatDetailList: [],
    chatValue: ''
  },
  // 获取聊天详情
  getChatDetail() {
    let that = this;
    let chatList = [];
    wx.request({
      url: app.globalData.siteBaseUrl + '/chat/find',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: {
        "userId": that.data.userInfo.id,
        "otherId": that.data.otherId,
      },
      success: function (res) {
        console.log('主动聊天详情--->', res)
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
        chatList = res.data.data;
        wx.request({
          url: app.globalData.siteBaseUrl + '/chat/find',
          method: 'GET',
          header: {
            'Content-Type': 'application/json',
            'X-Token': that.data.userInfo.token
          },
          data: {
            "userId": that.data.otherId,
            "otherId": that.data.userInfo.id
          },
          success: function (res) {
            console.log('被聊天详情--->', res)
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
            chatList = [...chatList, ...res.data.data];
            chatList.sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime());
            that.setData({
              chatDetailList: chatList
            })
          }
        })
      }
    })
  },
  // 获取当前时间
  getCurrentTime() {
    return new Date(+new Date() + 8 * 3600 * 1000)
	    .toJSON()
	    .substr(0, 19)
	    .replace("T", " ")
  },
  changeValue(e) {
    this.setData({
      chatValue: e.detail
    })
  },
  // 发送
  sendChat() {
    let that = this;
    if (!that.data.chatValue.trim()) {
      wx.showToast({
        title: "请输入文本内容",
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    let chat = {
      id: Math.round(Math.random() * 9999) + 1,
      userId: that.data.userInfo.id,
      createTime: that.getCurrentTime(),
      content: that.data.chatValue.trim(),
      name: that.data.userInfo.name || that.data.userInfo.username,
      otherId: that.data.otherId
    }
    wx.request({
      url: app.globalData.siteBaseUrl + '/chat/add',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: JSON.stringify(chat),
      success: function(res) {
        console.log('发送聊天--->', res)
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
            title: "发送失败",
            icon: 'none',
            duration: 2000,
          })
          return;
        } else {
          wx.showToast({
            title: "发送成功",
            icon: 'none',
            duration: 2000,
          })
          that.setData({
            chatValue: ''
          })
          that.getChatDetail();
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.setData({
      otherId: Number(options.otherId)
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
    this.getChatDetail();
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
// pages/message/message.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    chatList: []
  },
  // 查询当前用户下的聊天列表
  getUserChatList() {
    let that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/chat/list',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: {
        "userId": that.data.userInfo.id
      },
      success: function(res) {
        console.log('聊天列表--->', res)
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
        // 按照时间从大到小排序
        list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
        // 处理数据，按照被聊天者id分组
        let newList = list.reduce((acc, currentValue) => {
          const existingGroup = acc.find(group => group[0].otherId === currentValue.otherId);
          if (existingGroup) {
            existingGroup.push(currentValue);
          } else {
            acc.push([currentValue]);
          }
          return acc;
        }, []);
        let finList = [];
        newList.forEach(item => {
          finList.push(item[0]);
        })
        that.setData({
          chatList: finList
        })
      }
    })
  },
  // 回复聊天
  replyChat(e) {
    let id = e.currentTarget.dataset.otherid;
    wx.navigateTo({
      url: '../../packageB/pages/chatMessage/chatMessage?otherId=' + id
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
    this.getUserChatList();
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
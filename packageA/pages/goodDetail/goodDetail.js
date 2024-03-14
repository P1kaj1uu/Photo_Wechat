// packageA/pages/goodDetail/goodDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    goodsId: 0,
    currentGoodsList: [],
    isDialogShow: false,
    radio: 1,
    typeList: [
      {
        id: 1,
        name: '微信'
      },
      {
        id: 2,
        name: '支付宝'
      }
    ],
    msgCount: 0,
    commentList: [],
    commentValue: ''
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
        let list = [];
        list.push(res.data.data);
        list.forEach(item => {
          item.avatar = '../../../static' + item.avatar
        })
        that.setData({
          currentGoodsList: list
        })
      }
    })
  },
  onDialogClose(e) {
    // 取消
    if (e.detail === 'cancel') {
      this.setData({
        radio: 1,
        isDialogShow: false
      })
    } else {
      // 确定
      this.payMoneyFn();
    }
  },
  onChangeRadio: function(e) {
    this.setData({
      radio: e.detail
    })
  },
  // 获取当前时间
  getCurrentTime() {
    return new Date(+new Date() + 8 * 3600 * 1000)
	    .toJSON()
	    .substr(0, 19)
	    .replace("T", " ")
  },
  payMoneyFn() {
    let that = this;
    let record = {
      id: Math.round(Math.random() * 9999) + 1,
      createTime: that.getCurrentTime(),
      userId: that.data.userInfo.id,
      status: 1,
      price: that.data.currentGoodsList[0].price,
      content: that.data.currentGoodsList[0].content,
      name: that.data.currentGoodsList[0].title
    }
    wx.request({
      url: app.globalData.siteBaseUrl + '/record/add',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: JSON.stringify(record),
      success: function(res) {
        console.log('新增订单--->', res)
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
            title: '购买失败',
            icon: 'none',
            duration: 2000,
          })
          return;
        } else {
          wx.showToast({
            title: '购买成功',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  },
  // 聊天
  chatHandle(e) {
    let that = this;
    let otherId = e.currentTarget.dataset.otherid;
    let otherName = e.currentTarget.dataset.othername;
    let chat = {
      id: Math.round(Math.random() * 9999) + 1,
      userId: that.data.userInfo.id,
      createTime: that.getCurrentTime(),
      content: "你好！请问可以聊聊吗？",
      name: that.data.userInfo.name || that.data.userInfo.username,
      otherId: otherId
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
        console.log('新增聊天--->', res)
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
          wx.showToast({
            title: `已向${otherName}打招呼，可前往消息页查看`,
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  },
  // 购买
  purchaseHandle() {
    this.setData({
      isDialogShow: true
    })
  },
  changeValueHandle(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },
  // 获取当前商品下的评论/评价
  getComment() {
    let that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/comment/find',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: {
        "goodsId": that.data.goodsId,
        "pageNum": 1,
        "pageSize": 100
      },
      success: function(res) {
        console.log('当前评论/评价--->', res)
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
          that.setData({
            commentList: res.data.data.list,
            msgCount: res.data.data.total
          })
        }
      }
    })
  },
  // 发送评论/评价
  addComment() {
    let that = this;
    if (!that.data.commentValue.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    let comment = {
      id: Math.round(Math.random() * 9999) + 1,
      name: that.data.userInfo.name || that.data.userInfo.username,
      content: that.data.commentValue.trim(),
      createTime: that.getCurrentTime(),
      goodsId: that.data.goodsId,
      userId: that.data.userInfo.id,
    }
    wx.request({
      url: app.globalData.siteBaseUrl + '/comment/add',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      data: JSON.stringify(comment),
      success: function(res) {
        console.log('新增评论/评价--->', res)
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
            title: '评论/评价失败',
            icon: 'none',
            duration: 2000,
          })
          return;
        } else {
          that.setData({
            commentValue: ''
          })
          wx.showToast({
            title: '评论/评价成功',
            icon: 'none',
            duration: 2000,
          })
          that.getComment();
        }
      }
    })
  },
  // 举报评论/评价
  reportComment(e) {
    let that = this;
    let content = e.currentTarget.dataset.commentname;
    let check = {
      id: Math.round(Math.random() * 9999) + 1,
      username: that.data.userInfo.username,
      isPass: 0,
      content: content,
      type: "举报投诉",
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
            url: '../../../pages/login/login',
          })
          return;
        }
        if (res.data.code !== 200) {
          wx.showToast({
            title: "举报失败",
            icon: 'none',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: "已提交举报",
            icon: 'none',
            duration: 2000,
          })
        }
      },
    })
  },
  // 删除评论/评价
  deleteComment(e) {
    let that = this;
    let commentId = e.currentTarget.dataset.commentid;
    wx.request({
      url: app.globalData.siteBaseUrl + '/comment/delete?commentId=' + commentId,
      method: 'DELETE',
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      success: function(res) {
        console.log('删除评论/评价--->', res)
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
            title: '删除失败',
            icon: 'none',
            duration: 2000,
          })
          return;
        } else {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 2000,
          })
          that.getComment();
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
    this.getComment();
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
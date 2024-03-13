// pages/publish/publish.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    count: 1, //设置只能传1张图片
    img_url: [],
    hideAdd: 0,
  },
  checkPhone(e) {
    let regx = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    // 判断手机号格式是否正确
    if (!regx.test(Number(e.detail.value))) {
      wx.showToast({
        title: "注意号码格式",
        icon: 'none',
        duration: 2000
      });
      return
    }
  },
  changeNum(e) {
    if (Number.isNaN(parseInt(e.detail.value))) {
      wx.showToast({
        title: "应该为数字",
        icon: 'none',
        duration: 2000
      });
    }
  },
  // 选择图片
  chooseImage: function() {
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) {
        if (res.tempFilePaths.length > 0) {
          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })
          // 图如果满了1张，不显示加图
          if (that.data.img_url.length >= that.data.count) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }
        }
      }
    })
  },
   // 预览图片
   previewImg: function(e) {
    let that = this;
    let img_url = that.data.img_url;
    let index = e.target.dataset.index;
    wx.previewImage({
      urls: img_url,
      current: img_url[index],
      success: function (res) {
        console.log(res);
      }
    })
  },
  // 图片上传
  uploadGoodsImg: function(goodsId) {
    let that = this;
    let imgFilePaths = that.data.img_url;
    let num = 0;
    for (let i = 0; i < imgFilePaths.length; i++) {
      wx.uploadFile({
        url: app.globalData.siteBaseUrl + '/goods/uploadGoodsImg',
        filePath: imgFilePaths[i],
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data',
          'X-Token': that.data.userInfo.token
        },
        formData: {
          goodsId: goodsId
        },
        success: function (res) {
          //接口调用成功的回调函数
        },
        //接口调用结束的回调函数（调用成功、失败都会执行）
        complete: function (res) {
          let data = JSON.parse(res.data);
          if (data.status == 500) {
            wx.hideLoading();
            wx.showToast({
              title: data.msg,
            });
          } else {
            num++;
            if (num == imgFilePaths.length) {
              // 图片已全部上传
              wx.hideLoading();
              wx.showToast({
                title: '约拍需求发布成功',
                icon: 'none',
                duration: 2000
              });
            }
          }
          // 发布成功后，删除新增的图片
          that.setData({
            img_url:[],
            hideAdd: 0
          })
          // 跳到首页
          wx.switchTab({
            url: '../home/home',
          }) 
        },
        fail: function (res) {
          // 可统计上传失败图片数
          console.log('上传图片失败');
        }
      })
    }
  },
  // 获取当前时间
  getCurrentTime() {
    return new Date(+new Date() + 8 * 3600 * 1000)
	    .toJSON()
	    .substr(0, 19)
	    .replace("T", " ")
  },
  // 发布
  saveGoods: function(e) {
    let that = this;
    let title = e.detail.value.title;
    let content = e.detail.value.content;
    let price = e.detail.value.price;
    let continueTime = e.detail.value.continuetime;
    let position = e.detail.value.position;
    let type = e.detail.value.type;
    let phone = e.detail.value.phone;
    let imgFilePaths = that.data.img_url;
    if (!title || !content || !price || !continueTime || !position || !type || !phone) {
      wx.showToast({
        title: "发布失败，必填项都不能为空",
        icon: 'none',
        duration: 2000
      });
      return;
    }
    // 判断图片是否是空
    if (imgFilePaths.length <= 0) {
      wx.showToast({
        title: "发布失败，图片不能空",
        icon: 'none',
        duration: 2000
      });
      return;
    }
    // 判断是否为数字
    if (Number.isNaN(parseInt(price)) || Number.isNaN(parseInt(continueTime))) {
      wx.showToast({
        title: "发布失败，价格天数应该为数字",
        icon: 'none',
        duration: 2000
      });
      return;
    }
    let regx = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    // 判断手机号格式是否正确
    if (!regx.test(Number(phone))) {
      wx.showToast({
        title: "发布失败，手机号码格式不正确",
        icon: 'none',
        duration: 2000
      });
      return;
    }
    let goods = {
      id: Math.round(Math.random() * 9999) + 1,
      price: price,
      title: title,
      content: content,
      name: that.data.userInfo.name || that.data.userInfo.username,
      phone: phone,
      createTime: that.getCurrentTime(),
      type: type,
      position: position,
      continueTime: continueTime,
      userId: that.data.userInfo.id,
      avatar: null
    }
    wx.showLoading({
      title: '商品发布中',
    })
    wx.request({
      url: app.globalData.siteBaseUrl + "/goods/add",
      data: JSON.stringify(goods),
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'X-Token': that.data.userInfo.token
      },
      success: function(res) {
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
        let result = res.data.data.id;
        // 信息新增成功后，再上传图片b
        if (result > 0) {
          wx.hideLoading();
          that.uploadGoodsImg(result);
        } else {
          wx.hideLoading();
          wx.showToast({
            title: "约拍发布失败",
            icon: 'none',
            duration: 2000
          });
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
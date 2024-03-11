var oldX = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否允许关闭
    enableClose: {
      type: Boolean,
      value: true
    },
    // 是否显示滑动拼图
    isShow: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    backImg: [
      'http://beijing.gongjuji.net/imgdata/big/d25ccb7f-e455-4f61-b596-bfefcefd77f9.jpg',
      'http://beijing.gongjuji.net/imgdata/big/aae1f030-0e27-4886-9842-d7192fe1c63e.jpg',
      'http://beijing.gongjuji.net/imgdata/big/6334cb3f-092a-4134-9e1e-9e21e4a6f453.jpg'
    ],
    backIndex: 0,
    isMove: false, //是否移动中
    status: -1, //状态 -1 初始值，1，成功，0 失败
    box: {
      width: 100,
      height: 100,
      back: ''
    }, //背景框大小
    position: {
      left: 200,
      top: 29,
      left2: 0,
    } //滑块位置
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //事件绑定
    //滑块事件
    startClick(e) {
      this.setData({
        isMove: true
      });
      if (e.touches.length > 0) {
        oldX = e.touches[0].pageX;
      }
    },
    moveClick(e) {
      var _this = this;
      var newX = 0;
      if (e.touches.length > 0) {
        newX = e.touches[0].pageX;
      }
      var span = newX - oldX;
      span = Math.max(span, 0);
      span = Math.min(span, _this.data.box.width - 50);
      _this.setData({
        'position.left2': span
      });
    },
    endClick() {
      var _this = this;
      //处理结果判断
      var position = _this.data.position;
      var span = Math.abs(position.left2 - position.left);
      // console.info(span);
      if (span > 3) {
        _this.setData({
          isMove: false,
          status: 0
        });
        setTimeout(() => {
          _this.refereshClick();
        }, 1000);
        //触发失败
        _this.triggerEvent('onerror', {}, {
          bubbles: false,
          composed: false
        });
      } else {
        _this.setData({
          isMove: false,
          status: 1
        });
        //1秒后关闭
        setTimeout(() => {
          _this.setData({
            isShow: false
          });
        }, 1000);
        //触发成功
        _this.triggerEvent('onsuccess', {}, {
          bubbles: false,
          composed: false
        });
      }
    },
    //刷新
    refereshClick() {
      var _this = this;
      var box = this.data.box;
      //随机宽度，高度
      var left = Math.round(Math.random() * (box.width - 100)) + 50;
      var top = Math.round(Math.random() * (box.height - 60)) + 20;
      _this.setData({
        'position.left': left,
        'position.top': top,
        'position.left2': 0,
        status: -1,
        isMove: false,
        'box.back': _this.data.backImg[1]
      });
    },
    //关闭
    closeClick() {
      this.setData({
        isShow: false
      });
    }
  },
  lifetimes: {
    ready() {
      var _this = this;
      //获取系统信息计算图片宽度高度
      wx.getSystemInfo({
        success: (result) => {
          var width = result.screenWidth - 20 - 20;
          var height = width / 16 * 9;
          _this.setData({
            box: {
              width: width,
              height: height
            }
          });
          //随机初始化位置
          _this.refereshClick();
        },
      })
    }
  }
})
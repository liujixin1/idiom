// pages/details/details.js
const db = wx.cloud.database();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex: 0,
    listindex: 0,
    dataCenter: [],
    log: false,
    shade: false,
    login: false,
    packet: false,
    open: false,
    next: false,
    gold: 0,
    topic: 0,
    packetPrice: 0,
    packetSum: 0,
    // src: '../../images/packet.mp3'
  },

  open() {
    const that = this;
    let index = that.data.listindex
    that.setPacket(parseFloat(that.data.packetSum))
    that.setData({
      open: true
    })
  },
  packetErr() {
    const that = this;
    that.setData({
      open: false,
      packet: false,
      next: true
    })
  },
  // 进入下一关
  nextBtn() {
    const that = this;
    this.setTopic()
    that.setData({
      swiperIndex: that.data.listindex + 1,
      next: false,
      shade: false
    })
    if (that.data.swiperIndex == that.data.dataCenter.length - 1) {
      that.getDatas()
    }
  },
  getData() {
    const that = this;
    wx.showLoading({
      title: '加载中...'
    })
    const PAGE = 10;
    db.collection('idiom').aggregate().sample({
        size: 5
      })
      .end().then(res => {
        wx.hideLoading()
        that.setData({
          dataCenter: res.list,
          // packetSum: res.data[0].sum
        })
      })
  },
  getDatas() {
    const that = this;
    const PAGE = 10;
    db.collection('idiom').aggregate()
      .sample({
        size: 5
      })
      .end().then(res => {
        let dataList = that.data.dataCenter;
        that.setData({
          dataCenter: dataList.concat(res.list)
        })
      })
  },
  slide(e) {
    const that = this;
  },
  setGold(gold) {
    const that = this;
    const _ = db.command
    db.collection('user').where({
      openId: that.data.openId
    }).update({
      data: {
        gold: _.set(that.data.gold - gold),
      },
      success: (() => {
        that.getGold(app.globalData.userInfo.openid)
      })
    })
  },
  setPacket(packet) {
    const that = this;
    const _ = db.command
    let sum = (that.data.packetPrice + packet).toFixed(3)
    db.collection('user').where({
      openId: that.data.openId
    }).update({
      data: {
        packet: _.set(sum),
      },
      success: (() => {})
    })
  },
  setTopic() {
    const that = this;
    const _ = db.command
    db.collection('user').where({
      openId: that.data.openId
    }).update({
      data: {
        topic: _.inc(1)
      },
      success: (() => {
        that.getGold(app.globalData.userInfo.openid)
      })
    })
  },
  
  clickItem(e) {
    const that = this;
    if (that.data.log) {
      if (that.data.gold > 0) {
        let listindex = e.currentTarget.dataset.listindex;
        let text = e.currentTarget.dataset.text;
        let bool = e.currentTarget.dataset.bool;
        that.setGold(5)
        if (bool) {
          let arrList = that.data.dataCenter[listindex].idiom;
          let sum = 0
          // console.log(sum,9999)
          if (that.data.packetPrice <= 10) {
            sum = (Math.random()*0.6).toFixed(2)
          }else if (that.data.packetPrice > 10 && that.data.packetPrice <= 20) {
            sum = (Math.random()*0.5).toFixed(2)
          } else if (that.data.packetPrice > 20 && that.data.packetPrice <= 25) {
            sum = (Math.random()*0.2).toFixed(2)
          } else if (that.data.packetPrice > 25 && that.data.packetPrice <= 28) {
            sum = (Math.random()*0.02).toFixed(2)
          } else if (that.data.packetPrice > 28) {
            sum = (Math.random()*0.004).toFixed(3)
          }
          console.log(sum, 999)
          arrList.forEach((res, index) => {
            if (res == "") {
              that.setData({
                [`dataCenter[${listindex}].idiom[${index}]`]: text,
                packetSum: sum,
                shade: true,
                packet: true,
                listindex: listindex
              })
            }
          })
        } else {
          wx.showToast({
            title: '不正确',
            icon: 'error',
            duration: 1000
          })
        }
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '您的金币不足，请返回小程序首页，获取更多金币',
          confirmText: '我知道了',
          confirmColor: '#F56C6C',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: `/pages/index/index`
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    } else {
      that.setData({
        shade: true,
        login: true
      })
    }
  },
  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  },
  //取消
  cancel() {
    const that = this;
    that.setData({
      shade: false,
      login: false
    })
  },
  // 登录
  getUserInfo: function (e) {
    const that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.login(e, function () {
        if (app.globalData.userInfo) {
          that.setData({
            shade: false,
            login: false,
            log: true
          })
          that.getGold(app.globalData.userInfo.openid)
        }
      })
    }
  },
  getGold(openId) {
    const that = this;
    db.collection('user').where({
        openId: openId,
      })
      .get().then(res => {

        that.setData({
          gold: res.data[0].gold,
          topic: res.data[0].topic,
          packetPrice: parseFloat(res.data[0].packet),
        })
      })
  },
  // 截获竖向滑动
  catchTouchMove: function (res) {
    return false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (app.globalData.userInfo) {
      that.getData()
      that.getGold(app.globalData.userInfo.openid)
      that.setData({
        log: true
      })
    } else {
      that.getData()
      that.setData({
        log: false
      })
    }
    // that.setData({
    //   itemid: options.itemid,
    //   dataid: options.id
    // })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   const that = this;
  //   return {
  //     title: that.data.dataCenter.name,
  //     imageUrl: that.data.dataCenter.img
  //   }
  // }
})
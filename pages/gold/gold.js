// pages/gold/gold.js
const db = wx.cloud.database();
const time = require('../../utils/util.js');
const app = getApp();
let videoAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    gold: 0,
    listData: []
  },
  setGold(gold) {
    const that = this;
    const _ = db.command
    db.collection('user').where({
      openId: that.data.openId
    }).update({
      data: {
        gold: _.inc(gold)
      },
      success: (() => {
        that.getGold(app.globalData.userInfo.openid)

      })
    })
  },
  getData() {
    const that = this;
    wx.showLoading({
      title: '加载中...'
    })
    db.collection('gold').get().then(res => {
      wx.hideLoading()
      that.setData({
        listData: res.data
      })
    })
  },
  toVideo() {
    const that = this;
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => {
            videoAd.show()
          })
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  },
  //前往小程序
  toProgram(e) {
    const that = this;
    let wxid = e.currentTarget.dataset.wxid;
    let num = parseInt(e.currentTarget.dataset.num);
    console.log(wxid, num, 1231321)
    wx.navigateToMiniProgram({
      appId: wxid,
      path: 'pages/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
        that.setGold(num)
      }
    })
  },
  getGold(openId) {
    const that = this;
    db.collection('user').where({
        openId: openId,
      })
      .get().then(res => {
        that.setData({
          gold: res.data[0].gold
        })

      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (app.globalData.userInfo) {
      that.getGold(app.globalData.userInfo.openid)
    }
    that.getData()
    that.setData({
      openId: options.openId
    })
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-adff7c0dd4faaf74'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      videoAd.onClose((status) => {
        if (status && status.isEnded || status === undefined) {
          // 正常播放结束，下发奖励
          // continue you code
          that.setGold(100)
        } else {
          // 播放中途退出，进行提示
        }


      })
    }
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
  onShareAppMessage: function () {

  }
})
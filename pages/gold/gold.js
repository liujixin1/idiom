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
    listData: [],
    lotteryNum: [0, 0, 0, 0, 0]
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
    if (app.globalData.userInfo) {
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
    } else {
      wx.showToast({
        title: '请先登录您的小程序',
        icon: 'none',
        duration: 2000
      })
    }

  },
  //前往小程序
  toProgram(e) {
    const that = this;
    if (app.globalData.userInfo) {
      let wxid = e.currentTarget.dataset.wxid;
      let num = parseInt(e.currentTarget.dataset.num);
      let index = e.currentTarget.dataset.index;
      let lotteryNum = that.data.lotteryNum;
      console.log(wxid, num, index, 1231321)
      switch (index) {
        case 0:
          if (lotteryNum[0] == 1) {

            wx.navigateToMiniProgram({
              appId: wxid,
              path: 'pages/index/index',
              extraData: {
                foo: 'bar'
              },
              envVersion: 'release',
              success(res) {
                // 打开成功
                // if()
                lotteryNum[0]--;
                that.setData({

                  [`lotteryNum[0]`]: lotteryNum[0],
                })
                wx.setStorageSync('sum1', lotteryNum[0])
                that.setGold(num)
              }
            })
          } else {
            wx.showToast({
              title: '每天只能领取一次',
              icon: 'none',
              duration: 2000
            })
          }
          break;
        case 1:
          if (lotteryNum[1] == 1) {

            wx.navigateToMiniProgram({
              appId: wxid,
              path: 'pages/index/index',
              extraData: {
                foo: 'bar'
              },
              envVersion: 'release',
              success(res) {
                // 打开成功
                // if()
                lotteryNum[1]--;
                that.setData({

                  [`lotteryNum[1]`]: lotteryNum[1],
                })
                wx.setStorageSync('sum2', lotteryNum[1])
                that.setGold(num)
              }
            })
          } else {
            wx.showToast({
              title: '每天只能领取一次',
              icon: 'none',
              duration: 2000
            })
          }
          break;
        case 2:
          if (lotteryNum[2] == 1) {

            wx.navigateToMiniProgram({
              appId: wxid,
              path: 'pages/index/index',
              extraData: {
                foo: 'bar'
              },
              envVersion: 'release',
              success(res) {
                // 打开成功
                // if()
                lotteryNum[2]--;
                that.setData({

                  [`lotteryNum[2]`]: lotteryNum[2],
                })
                wx.setStorageSync('sum3', lotteryNum[2])
                that.setGold(num)
              }
            })
          } else {
            wx.showToast({
              title: '每天只能领取一次',
              icon: 'none',
              duration: 2000
            })
          }
          break;
        case 3:
          if (lotteryNum[3] == 1) {

            wx.navigateToMiniProgram({
              appId: wxid,
              path: 'pages/index/index',
              extraData: {
                foo: 'bar'
              },
              envVersion: 'release',
              success(res) {
                // 打开成功
                // if()
                lotteryNum[3]--;
                that.setData({

                  [`lotteryNum[3]`]: lotteryNum[3],
                })
                wx.setStorageSync('sum4', lotteryNum[3])
                that.setGold(num)
              }
            })
          } else {
            wx.showToast({
              title: '每天只能领取一次',
              icon: 'none',
              duration: 2000
            })
          }
          break;
        case 4:
          if (lotteryNum[4] == 1) {

            wx.navigateToMiniProgram({
              appId: wxid,
              path: 'pages/index/index',
              extraData: {
                foo: 'bar'
              },
              envVersion: 'release',
              success(res) {
                // 打开成功
                // if()
                lotteryNum[4]--;
                that.setData({

                  [`lotteryNum[4]`]: lotteryNum[4],
                })
                wx.setStorageSync('sum5', lotteryNum[4])
                that.setGold(num)
              }
            })
          } else {
            wx.showToast({
              title: '每天只能领取一次',
              icon: 'none',
              duration: 2000
            })
          }
          break;
      }

    } else {
      wx.showToast({
        title: '请先登录您的小程序',
        icon: 'none',
        duration: 2000
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
          gold: res.data[0].gold
        })

      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let timestamp = Date.parse(new Date());
    let startTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    let date = wx.getStorageSync('date')
    console.log(timestamp, date, 888)
    if (timestamp > date) {
      wx.setStorageSync('sum1', 1)
      wx.setStorageSync('sum2', 1)
      wx.setStorageSync('sum3', 1)
      wx.setStorageSync('sum4', 1)
      wx.setStorageSync('sum5', 1)
      wx.setStorageSync('date', Date.parse(startTime))
    }
    that.setData({
      [`lotteryNum[0]`]: wx.getStorageSync('sum1'),
      [`lotteryNum[1]`]: wx.getStorageSync('sum2'),
      [`lotteryNum[2]`]: wx.getStorageSync('sum3'),
      [`lotteryNum[3]`]: wx.getStorageSync('sum4'),
      [`lotteryNum[4]`]: wx.getStorageSync('sum5'),

    })
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
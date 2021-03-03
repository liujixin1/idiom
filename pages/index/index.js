// pages/index/index.js
const db = wx.cloud.database();
const time = require('../../utils/util.js');
const app = getApp();
let interstitialAd = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [{
        img: '../../images/authorImg1.jpg',
        text: '获得4.4元红包'
      },
      {
        img: '../../images/authorImg2.jpg',
        text: '获得4.4元红包'
      },
      {
        img: '../../images/authorImg3.jpg',
        text: '获得4.4元红包'
      },
      {
        img: '../../images/authorImg4.jpg',
        text: '获得4.4元红包'
      },
      {
        img: '../../images/authorImg5.jpg',
        text: '获得4.4元红包'
      },
      {
        img: '../../images/authorImg6.jpg',
        text: '获得4.4元红包'
      },
      {
        img: '../../images/authorImg7.jpg',
        text: '获得4.4元红包'
      },
      {
        img: '../../images/authorImg8.jpg',
        text: '获得4.4元红包'
      },
      {
        img: '../../images/authorImg9.jpg',
        text: '获得4.4元红包'
      },
      {
        img: '../../images/authorImg10.jpg',
        text: '获得4.4元红包'
      },

    ],
    rankingList: [{
        mark: 1,
        img: '../../images/authorImg1.jpg',
        name: '闲聊',
        text: 5439
      },
      {
        mark: 2,
        img: '../../images/authorImg2.jpg',
        name: '闲聊',
        text: 5124
      },
      {
        mark: 3,
        img: '../../images/authorImg3.jpg',
        name: '闲聊',
        text: 5034
      },
      {
        mark: 4,
        img: '../../images/authorImg4.jpg',
        name: '闲聊',
        text: 4931
      },
      {
        mark: 5,
        img: '../../images/authorImg5.jpg',
        name: '闲聊',
        text: 4876
      },
      {
        mark: 5,
        img: '../../images/authorImg6.jpg',
        name: '闲聊',
        text: 4865
      },
      {
        mark: 7,
        img: '../../images/authorImg7.jpg',
        name: '闲聊',
        text: 4804
      },
      {
        mark: 8,
        img: '../../images/authorImg8.jpg',
        name: '闲聊',
        text: 4777
      },
      {
        mark: 9,
        img: '../../images/authorImg9.jpg',
        name: '闲聊',
        text: 4769
      },
      {
        mark: 10,
        img: '../../images/authorImg10.jpg',
        name: '闲聊',
        text: 4755
      },

    ],
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    form: {
      appId: '',
      openId: '',
      gold: 0,
      packet: 0,
      topic: 0,
    },
    shade: false,
    ranking: false
  },
  //继续答题
  rankingBtn() {
    const that = this;
    that.setData({
      shade: false,
      ranking: false
    })
  },
  //显示排行榜
  showRanking() {
    const that = this;
    that.setData({
      shade: true,
      ranking: true
    })
  },
  //金币列表
  toGold() {
    const that = this;
    wx.navigateTo({
      url: `/pages/gold/gold?openId=${that.data.form.openId}`
    })
  },
  // 截获竖向滑动
  catchTouchMove: function (res) {
    return false
  },
  //红包列表
  toPacket() {
    const that = this;
    wx.navigateTo({
      url: `/pages/packet/packet?openId=${that.data.packet}`
    })
  },
  getData(openId) {
    const that = this;
    // wx.showLoading({
    //   title: '加载中...'
    // })
    console.log(openId, 999999)
    db.collection('user').where({
        openId: openId,
      })
      .get().then(res => {
        // wx.hideLoading()
        that.setData({
          form: res.data[0]
        })
      })
  },
  getUserInfo: function (e) {
    const that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.login(e, function () {
        console.log(e, 6666)
        that.getData(e.detail.userInfo.openid)
        that.setData({
          userInfo: e.detail.userInfo
        })
      });
    }
  },
  toDetails() {
    const that = this;
    wx.navigateTo({
      url: `/pages/details/details?openId=${that.data.form.openId}&packet=${that.data.form.packet}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (wx.createInterstitialAd) {
    //   interstitialAd = wx.createInterstitialAd({
    //     adUnitId: 'adunit-36d3c526fbab48cc'
    //   })
    //   interstitialAd.onLoad(() => {})
    //   interstitialAd.onError((err) => {})
    //   interstitialAd.onClose(() => {})
    // }

    // // 在适合的场景显示插屏广告
    // if (interstitialAd) {
    //   interstitialAd.show().catch((err) => {
    //     console.error(err)
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    const that = this;
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo, 777)
      that.getData(app.globalData.userInfo.openid)
      that.setData({
        userInfo: app.globalData.userInfo
      })
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const that = this;
    return {
      title: '微信红包封面',
      imageUrl: that.data.banner[0].img
    }
  },


})
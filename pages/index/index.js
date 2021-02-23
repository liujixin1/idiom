// pages/index/index.js
const db = wx.cloud.database();
const time = require('../../utils/util.js');
const app = getApp();
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
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    form: {
      appId: '',
      gold: 0,
      packet: 0,
      topic: 0,
    }
  },
  getData(openId) {
    const that = this;
    db.collection('user').where({
        openId: openId,
      })
      .get().then(res => {
        that.setData({
          form: res.data[0]
        })
      })
  },
  getUserInfo: function (e) {
    const that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.login(e, function () {
        that.getData(e.detail.userInfo.openId)
        that.setData({
          userInfo: e.detail.userInfo
        })
      });
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      that.getData(app.globalData.userInfo.openId)
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
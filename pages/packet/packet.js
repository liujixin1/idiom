// pages/packet/packet.js
const db = wx.cloud.database();
const time = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    packet:0
  },
//领取红发
packet(e){
  const that = this;
  if(app.globalData.userInfo){
    if(that.data.packet >=e.currentTarget.dataset.sum){
      wx.showToast({
        title: '兑换红包，请联系客服',
        icon:'none',
        duration: 2000
      })
    }else{
      wx.showToast({
        title: '您的红包余额不足',
        icon:'none',
        duration: 2000
      })
    }
  }else{
    wx.showToast({
      title: '请先登录您的小程序',
      icon:'none',
      duration: 2000
    })
  }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      packet:options.packet
    })
    that.getData()
  },
  getData() {
    const that = this;
    wx.showLoading({
      title: '加载中...'
    })
    db.collection('packet').get().then(res => {
      wx.hideLoading()
      that.setData({
        listData: res.data
      })
    })
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

  // }
})
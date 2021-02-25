// pages/details/details.js
const db = wx.cloud.database();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex: 0,
    dataCenter: [{
      title: ['你', '', '我', '他'],
      titleImg: "../../images/xx107.png",
      textList: [{
          text: '好',
          bool: false,
        },
        {
          text: '行',
          bool: true,
        },
        {
          text: '本',
          bool: false,
        },
        {
          text: '计',
          bool: false,
        }
      ],
      sum: 0.34
    },
    {
      title: ['你', '', '我', '他'],
      titleImg:"../../images/3.png",
      textList: [{
          text: '好',
          bool: false,
        },
        {
          text: '行',
          bool: true,
        },
        {
          text: '本',
          bool: false,
        },
        {
          text: '计',
          bool: false,
        }
      ],
      sum: 0.34
    },
    {
      title: ['你', '', '我', '他'],
      titleImg: "../../images/2.png",
      textList: [{
          text: '好',
          bool: false,
        },
        {
          text: '行',
          bool: true,
        },
        {
          text: '本',
          bool: false,
        },
        {
          text: '计',
          bool: false,
        }
      ],
      sum: 0.34
    }
  ],
    achieve: false,
    page: 1,
    pageSize: ''

  },
  getData(id) {
    const that = this;
    wx.showLoading({
      title: '加载中...'
    })
    db.collection('test').doc(id).get().then(res => {
      setTimeout(() => {
        wx.hideLoading()
      }, 500)
      that.setData({
        pageSize: res.data.testList.length
      })
      that.setData({
        dataCenter: res.data
      })
    })
  },
  slide(e) {
    const that = this;
    that.setData({
      page: e.detail.current + 1
    })
    if (that.data.page == that.data.pageSize) {
      that.setData({
        swiperIndex: e.detail.current,
        achieve: true
      })
    } else {
      that.setData({
        swiperIndex: e.detail.current,
        achieve: false
      })
    }

  },
  clickItem(e) {
    const that = this;
    let listindex = e.currentTarget.dataset.listindex;
    let bool = e.currentTarget.dataset.bool;
    if(bool){
      if(that.data.swiperIndex==2){
        that.setData({
          swiperIndex: 0
        })
      }else{
        that.setData({
          swiperIndex: listindex + 1
        })
      }
     
    }
      
    
  },
  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  },
  // 登录
  getUserInfo: function (e) {
    const that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {

      if (app.globalData.userInfo) {

        if (that.data.dataCenter.resultList) {
          let arr = [];
          for (var i = 0; i < that.data.pageSize; i++) {
            arr[i] = that.data.dataCenter.resultList[i]
          }
          let bool = arr.some(res => {
            return res == undefined
          })
          if (!bool) {
            wx.showLoading({
              title: '生成海报'
            })
            console.log(that.data.itemid)
            setTimeout(() => {
              if (that.data.itemid == 2) {
                that.getAvatarUrl(app.globalData.userInfo.avatarUrl)
              }

            }, 1000)
          } else {
            wx.showModal({
              content: '选项未选，请再去选着',
              showCancel: false
            })
          }

        } else {
          wx.showModal({
            content: '选项未选，请再去选着',
            showCancel: false
          })
        }
      } else {

        app.login(e, function () {
          if (that.data.dataCenter.resultList) {
            let arr = [];
            for (var i = 0; i < that.data.pageSize; i++) {
              arr[i] = that.data.dataCenter.resultList[i]
            }
            let bool = arr.some(res => {
              return res == undefined
            })
            if (!bool) {
              wx.showLoading({
                title: '生成海报'
              })
              setTimeout(() => {
                if (that.data.itemid == 2) {
                  that.getAvatarUrl(app.globalData.userInfo.avatarUrl)
                }
              }, 1000)

            } else {
              wx.showModal({
                content: '选项未选，请再去选着',
                showCancel: false
              })
            }

          } else {
            wx.showModal({
              content: '选项未选，请再去选着',
              showCancel: false
            })
          }
        });
      }

    }
  },
  //头像链接转换
  transitionImg(src) {
    let top = 'cloud://home-520bf8.686f-home-520bf8-1255630290/';
    let imgUrl = src.split(top);
    return 'https://686f-home-520bf8-1255630290.tcb.qcloud.la/' + imgUrl[1];
  },
  getAvatarUrl(avatarUrl) {
    const that = this;
    //获取图片信息
    wx.getImageInfo({
      src: avatarUrl,
      success: function (res) {
        //上传图片
        const tempFilePaths = res.path;
        //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        //拓展名
        var fileExt = tempFilePaths.replace(/.+\./, "");
        //拼接成图片名
        let keepname = 'userImg/' + time + '.' + fileExt;
        wx.cloud.uploadFile({
          cloudPath: keepname,
          filePath: tempFilePaths, // 文件路径
        }).then(e => {

          let imgUrl = that.transitionImg(e.fileID)
          wx.hideLoading()
          wx.navigateTo({
            url: `/pages/part/pages/placard2/placard2?center=${that.data.dataCenter.resultList}&id=${that.data.dataid}&userImg=${imgUrl}`
          })
        }).catch(error => {
          // handle error
        })

      },
      fail: function (srev) {
        console.log(srev);
      }
    });
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
    // that.setData({
    //   itemid: options.itemid,
    //   dataid: options.id
    // })
    // that.getData(options.id)
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
    const that = this;
    return {
      title: that.data.dataCenter.name,
      imageUrl: that.data.dataCenter.img
    }
  }
})
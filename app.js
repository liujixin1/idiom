//app.js
App({
  onLaunch: function () {
    const that = this;
    // 初始化数据库
    wx.cloud.init({
      env: "home-4gev7v2if54f1e14"
    })

    //获取导航高度
    // wx.getSystemInfo({
    //   success: res => {
    //     this.globalData.navHeight = res.statusBarHeight + 46;
    //   },
    //   fail(err) {
    //     console.log(err);
    //   }
    // })
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }

    //获取屏幕高度
    // wx.getSystemInfo({
    //   success(res) {
    //     console.log(res)
    //     that.globalData.screenHeight = res.screenHeight;
    //     that.globalData.windowHeight = res.windowHeight;

    //   }
    // })
  },

  // 添加用户
  pushUserData(user) {
    const db = wx.cloud.database()
    const that = this;
    db.collection('user').where({
        openId: user.openId,
      })
      .get().then(res => {
        if (res.data.length == 0) {
          db.collection('user').add({
            data: {
              openId: user.openId,
              gold: 0,
              packet: 0,
              topic: 0
            }
          })
        }
      })
  },
  /*方法说明
   *@method userAuthorization 检测用户信息授权(供“我的”页面授权链接调用)
   *@return {promise} resolve 成功回调
   *@return {promise} reject 失败回调
   */
  userAuthorization() {
    const that = this;
    return new Promise((resolve, reject) => {
      if (that.globalData.userInfo) {
        resolve(true)
      } else {
        wx.showModal({
          content: '您还没有登录哟,请先登录',
          showCancel: false,
          confirmText: '我知道了',
          confirmColor: '#ff5151'
        })
        reject(false)
      }
    })
  },
  //头像链接转换
  transitionImg(src) {
    let top = 'cloud://home-4gev7v2if54f1e14.686f-home-4gev7v2if54f1e14-1304885413/';
    let imgUrl = src.split(top);
    return 'https://686f-home-4gev7v2if54f1e14-1304885413.tcb.qcloud.la/' + imgUrl[1];
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
        let keepname = 'userImg/'+time + '.' + fileExt;
        wx.cloud.uploadFile({
          cloudPath: keepname,
          filePath: tempFilePaths, // 文件路径
        }).then(e => {

          let imgUrl = that.transitionImg(e.fileID)
          console.log(imgUrl,8888888)
         
        }).catch(error => {
          // handle error
        })

      },
      fail: function (srev) {
        console.log(srev);
      }
    });
  },
  /*方法说明
   *@method publicAuthorization 检测用户信息授权(供“详情”页面授权链接调用)
   *@return {promise} resolve 成功回调
   *@return {promise} reject 失败回调
   */
  publicAuthorization() {
    const that = this;
    return new Promise((resolve, reject) => {
      if (that.globalData.userInfo) {
        resolve(true)
      } else {
        wx.navigateTo({
          url: `/pages/login/login`
        })
        reject(false)
      }
    })
  },
  /*方法说明
   *@method login 登录，获取openid
   */
  login(e, callback) {
    const that = this;
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        e.detail.userInfo.openid = res.result.event.userInfo.openId;
        that.globalData.userInfo = e.detail.userInfo;
        callback()
        wx.setStorageSync('userInfo', e.detail.userInfo)
        that.getAvatarUrl(e.detail.userInfo.avatarUrl)
        that.pushUserData(res.result.event.userInfo)
      }
    })
  },
  globalData: {
    userInfo: null,
  }
})
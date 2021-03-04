//app.js
App({
  onLaunch: function () {
    const that = this;
    // 初始化数据库
    wx.cloud.init({
      env: "home-4gev7v2if54f1e14"
    })

    
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }

    
  },

  // 添加用户
  pushUserData(user,callback) {
    const db = wx.cloud.database()
    const that = this;
    db.collection('user').where({
        openId: user.openId,
      })
      .get().then(res => {
        if (res.data.length== 0) {
          db.collection('user').add({
            data: {
              openId: user.openId,
              gold: 100,
              packet: 0,
              topic: 0
            }
          }).then(()=>{
            callback()
            // that.getAvatarUrl(user,avatarUrl)
          })
        }else{
          callback()
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
  getAvatarUrl(user,avatarUrl) {
    const db = wx.cloud.database()
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
          db.collection('user').where({openId:user.openId}).update({
            data: {
              avatarUrl:imgUrl
            },
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
        wx.setStorageSync('userInfo', e.detail.userInfo)
        that.pushUserData(res.result.event.userInfo, callback)
        wx.setStorageSync('sum1', 1)
        wx.setStorageSync('sum2', 1)
        wx.setStorageSync('sum3', 1)
        wx.setStorageSync('sum4', 1)
        wx.setStorageSync('sum5', 1)

        let startTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
        // 当天0点
        wx.setStorageSync('date', Date.parse(startTime))
       

      }
    })
  },
  globalData: {
    userInfo: null,
  }
})
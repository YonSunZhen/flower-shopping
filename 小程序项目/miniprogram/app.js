//app.js
App({
  isLogin: false,//全局都可访问
  isManager: false,//是否管理员
  userInfo: { }, //全局的用户信息

  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {};

    wx.getSetting({
      success: res => {
        // console.log(res);
        //查找是否有在数据库中，没有的话isLogin为false
        if (res.authSetting['scope.userInfo']) {
          // console.log(res.authSetting['scope.userInfo']);
          wx.getUserInfo({
            success: res => {
              //从数据库获取用户信息
              // that.queryUsreInfo();
              //用户已经授权过
              // wx.switchTab({
              //   url: '/pages/index/index'
              // })
              this.isLogin = true;
              this.userInfo = res.userInfo;
              wx.cloud.callFunction({
                name: 'login'
              }).then(res => {
                const user_openid = res.result.openid;
                //这里添加管理员的openid
                if (user_openid === "oTy3U5B5uMil2A8ltOIijqEbXoo8") {
                  this.isManager = true;
                }
              })
              console.log(res);
              console.log("已经授权登录");
            }
          });
        }else{
          console.log("还未授权");
        }
      }
    })

  }
})

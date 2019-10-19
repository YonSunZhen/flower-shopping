//app.js
wx.cloud.init();
const manager = require('./api/manager.js');
const servicer = require('./api/servicer.js');
App({
  isLogin: false,//全局都可访问
  isManager: false,//是否管理员
  isService: false, //是否是客服人员
  userInfo: { }, //全局的用户信息
  openid: '',


  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    wx.showShareMenu({
      withShareTicket: true
    })

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
                this.openid = user_openid;
                //这里添加管理员的openid
                manager.getManagerId().then((res) => {
                  let arry = [];
                  for(let i = 0; i < res.length; i++) {
                    arry.push(res[i].appid);
                  }
                  if (arry.indexOf(user_openid) > -1) {
                    this.isManager = true;
                  }
                })
                //这里添加客服人员的openid o8wZX44dK_lJ0HhnGN1gX4NIOtUU
                servicer.getServicerId().then((res) => {
                  let arry = [];
                  for (let i = 0; i < res.length; i++) {
                    arry.push(res[i].appid);
                  }
                  if (arry.indexOf(user_openid) > -1) {
                    this.isService = true;
                  }
                })
              })
              // console.log(res);
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

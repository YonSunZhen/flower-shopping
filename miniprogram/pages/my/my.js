// miniprogram/pages/my/my.js
const user = require('../../api/user_info.js');
const manager = require('../../api/manager.js');
const servicer = require('../../api/servicer.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: "",
    username: '',
    isManager: '',
    isService: '',
    userInfo: { }, //用户的头像和姓名
  },

  login: function(event) {
    this.setData({
      username: JSON.parse(event.detail.rawData).nickName
    })
    this.setData({
      userInfo: event.detail.userInfo
    })
    // const username = event.detail.rawData.nickname;
    if (event.detail.userInfo) {
      //获取用户的openid
      wx.cloud.callFunction({
        name: 'login',
        data: {
          test: 1
        }
      }).then(res => {
        const user_openid = res.result.openid;
        //这里验证管理员的openid
        manager.getManagerId().then((res) => {
          let arry = [];
          for (let i = 0; i < res.length; i++) {
            arry.push(res[i].appid);
          }
          if (arry.indexOf(user_openid) > -1) {
            this.setData({
              isManager: true
            })
            getApp().isManager = true;
          }
        })

        //这里验证客服人员的openid 
        servicer.getServicerId().then((res) => {
          let arry = [];
          for (let i = 0; i < res.length; i++) {
            arry.push(res[i].appid);
          }
          if (arry.indexOf(user_openid) > -1) {
            this.setData({
              isService: true
            })
            getApp().isService = true;
          }
        })

        this.setData({
          isLogin: true
        });
        getApp().isLogin = true;
        getApp().openid = user_openid; 
        const userData = {
          user_openid: user_openid,
          username: this.data.username,
          user_address_id: []
        }
        //添加用户到数据库(添加时检查一下用户是否已存在)
        user.isExist(user_openid).then(res => {
          // console.log(res);
          if(res === "false"){
            user.addUser(userData).then((res) => {
              if (res === "true") {
                console.log("添加成功");
              } else {
                console.log("添加失败");
              }
            })
          }else{
            console.log("用户已存在");
          }
        })
      })
      console.log("登陆成功");
    }else{
      console.log("登陆失败");
    }  
  },

  //点击进行中按钮(管理员)
  goOrder1(e) {
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `../all-order/all-order?type=${type}`,
    })
  },

  //点击进行中按钮(普通用户)
  goOrder(e) {
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `../order-list/order-list?type=${type}`,
    })
    // console.log(e);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心',
    });
    this.setData({
      isLogin: getApp().isLogin
    });

    if (getApp().isManager) {
      this.setData({
        isManager: getApp().isManager
      })
    }
    if (getApp().isService) {
      this.setData({
        isService: getApp().isService
      })
    }

    this.setData({
      userInfo: getApp().userInfo
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
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      // app.goLoginPageTimeOut()
    } else {
      that.setData({
        userInfo: userInfo
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
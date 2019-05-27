// miniprogram/pages/shop-cart/shop-cart.js
const cart = require('../../api/order_cart.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: {
      isLogin: false,
      openid: '',
      list: []
    },
  },

  _getCartDetail(user_id) {
    cart.getCartByUserid(user_id).then((res) => {
      
      const list = JSON.parse(JSON.stringify(res.data[0].cart_products));
      this.setGoodsList(list);
      console.log("购物车数据");
      console.log(list);
    })
  },

  //设置模板数据
  setGoodsList(list) {
    this.setData({
      goodsList: {
        isLogin: getApp().isLogin,
        openid: getApp().openid,
        list: list,
      }
    });
  },

  //点击去逛逛
  toIndexPage() {
    //跳到tabBar页面
    wx.switchTab({
      url: '../index/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '购物车',
    })
    this.setGoodsList([1, 2, 3]);
    this._getCartDetail(this.data.goodsList.openid);
    console.log(this.data.goodsList.isLogin);
    console.log(this.data.goodsList.list.length);
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
    this.setGoodsList([1, 2, 3]);
    this._getCartDetail(this.data.goodsList.openid);
    // console.log(this.data.goodsList.isLogin);
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
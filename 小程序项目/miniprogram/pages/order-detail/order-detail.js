// pages/order-detail/order-detail.js
const order = require('../../api/order_info.js');
const address = require('../../api/user_addr.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: {},//订单信息
    curAddressData: {} //地址信息
  },

  //获取订单详情
  _getOrderList(id) {
    order.getOrderDetail(id).then((res) => {
      let address_id = res.address_id;
      //更改时间格式
      res.create_time = res.create_time.toLocaleString().split('GMT')[0];
      this.setData({
        orderList: res
      })
      //获取配送信息
      address.getAddressDetail(address_id).then((res) => {
        this.setData({
          curAddressData: res
        })
        // console.log('00000');
        // console.log(res);
      })
      // console.log('1111111');
      // console.log(this.data.orderList);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    this._getOrderList(options.id);
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
  onShareAppMessage: function () {

  }
})
const address = require('../../api/user_addr.js');
const order = require('../../api/order_info.js');
const product = require('../../api/product_info.js');
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    totalScoreToPay: 0,
    openid: '',
    curAddressData: {},
    isAddrSelected: 'false'
  },

  //创建订单
  createOrder(e) {
    if (JSON.stringify(this.data.curAddressData) === "{}") {
      wx.showToast({
        title: '请先选择收货地址',
        icon: 'none'
      })
    }else{
      wx.showLoading({
        title: '提交中',
      })
      const deliver_time = e.detail.value.deliver_time;
      const deliver_remark = e.detail.value.deliver_remark;
      let order_products = [];
      for(let i = 0; i < this.data.goodsList.length; i++) {
        let obj = {
          product_id: this.data.goodsList[i].product_id,
          order_quantity: this.data.goodsList[i].order_quantity,
          product_name: this.data.goodsList[i].product_name,
          price: this.data.goodsList[i].price,
          img: this.data.goodsList[i].img
        }
        order_products.push(obj);
      }
      let data = {
        user_id: this.data.openid,
        address_id: this.data.curAddressData._id,
        order_products: order_products,
        create_time: db.serverDate(),
        order_money: this.data.totalScoreToPay,
        order_status: 0,
        deliver_time: deliver_time,
        deliver_remark: deliver_remark
      };
      order.addOrder(data).then((res) => {
        if (res === 'true') {
          //修改库存
          let promiseArr = [];
          for(let i = 0; i < this.data.goodsList.length; i++) {
            promiseArr.push(new Promise((resolve, reject) => {
              let product_id = this.data.goodsList[i].product_id;
              let order_quantity = this.data.goodsList[i].order_quantity;
              product.getOneProduct(product_id).then((res) => {
                let product_surplus = res[0].product_surplus;
                let product_sale = res[0].product_sale;
                product_sale = product_sale + order_quantity;
                product_surplus = product_surplus - order_quantity;
                let data = {
                  product_sale: product_sale,
                  product_surplus: product_surplus
                }
                wx.cloud.callFunction({
                  name: 'editProduct',
                  data: {
                    id: product_id,
                    data: data
                  }
                }).then((res) => {
                  if (res.result.stats.updated > 0) {
                    resolve();
                  } else {
                    console.log("提交订单出错");
                  }
                })
              })
            })) 
          }

          Promise.all(promiseArr).then(() => {
            wx.hideLoading();
            wx.showToast({
              title: '提交成功!',
            })
            wx.navigateTo({
              url: '../order-list/order-list?type=0',
            })
          })
         
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '提交失败!',
          })
        }
      })
    }
  },

  //选择新地址
  selectAddress() {
    wx.navigateTo({
      url: '../select-address/select-address',
    })
  },

  //点击新增收货地址
  addAddress() {
    wx.navigateTo({
      url: '../add-address/add-address?type=add',
    })
  },

  //初始化页面数据
  init() {
    try {
      let value = wx.getStorageSync('goodLists');
      this.setData({
        goodsList: JSON.parse(JSON.stringify(value))
      })
    } catch (e) {
    }
    //获取总金额
    let totalMoney = 0;
    for(let i = 0; i < this.data.goodsList.length; i++) {
      let temp = this.data.goodsList[i].price * this.data.goodsList[i].order_quantity;
      totalMoney += temp;
    }
    this.setData({
      totalScoreToPay: totalMoney
    })
    //获取用户id
    this.setData({
      openid: getApp().openid
    })
    //获取用户配送信息
    address.getAddressSelected(this.data.openid).then((res) => {
      if(res.length > 0) {
        this.setData({
          curAddressData: res[0],
          isAddrSelected: 'true'
        })
      }else{
        address.getAddressByUser(this.data.openid).then((res) => {
          if (res.length > 0) {
            this.setData({
              curAddressData: {},
              isAddrSelected: 'error'
            })
          }else{
            this.setData({
              curAddressData: {},
              isAddrSelected: 'false'
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
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
    this.init();
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
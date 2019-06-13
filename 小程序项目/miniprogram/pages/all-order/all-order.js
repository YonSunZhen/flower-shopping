// pages/order-list/order-list.js
const order = require('../../api/order_info.js');
const product = require('../../api/product_info.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusType: ["进行中", "已完成"],
    currentType: 0,
    orderList: [],
    openid: ''
  },

  //删除订单
  deleteOrderTap(e) {
    let order_id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      content: '确定删除此订单吗?',
      showCancel: true,
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            // title: '删除中'
          })

          wx.cloud.callFunction({
            name: 'delOrder',
            data: {
              id: order_id
            }
          }).then((res) => {
            if (res.result.stats.removed > 0) {
              console.log("成功删除订单");
              let array = JSON.parse(JSON.stringify(this.data.orderList));
              array.splice(index, 1);
              this.setData({
                orderList: array
              })
              wx.hideLoading();
              wx.showToast({
                title: '已删除',
              })
            }
          })


        }
      }
    });
  },

  //取消订单
  cancelOrderTap(e) {
    let order_id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      content: '确定取消此订单吗?',
      showCancel: true,
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            // title: '删除中'
          })

          wx.cloud.callFunction({
            name: 'delOrder',
            data: {
              id: order_id
            }
          }).then((res) => {
            if (res.result.stats.removed > 0) {
              console.log("成功取消订单");
              let order_products = this.data.orderList[index].order_products;
              let promiseArr = [];
              for (let i = 0; i < order_products.length; i++) {
                let product_id = order_products[i].product_id;
                let order_quantity = order_products[i].order_quantity;
                promiseArr.push(new Promise((resolve, reject) => {
                  //确定这个商品是否还存在
                  product.isExistById(product_id).then((res) => {
                    if (res == 'true') {
                      //存在的话获取原商品的库存信息
                      product.getOneProduct(product_id).then((res) => {
                        console.log('222222');
                        console.log(res);
                        let product_surplus = res[0].product_surplus;
                        let product_sale = res[0].product_sale;
                        product_sale = product_sale - order_quantity;
                        product_surplus = product_surplus + order_quantity;
                        let data = {
                          product_sale: product_sale,
                          product_surplus: product_surplus
                        }
                        //更新库存信息
                        wx.cloud.callFunction({
                          name: 'editProduct',
                          data: {
                            id: product_id,
                            data: data
                          }
                        }).then((res) => {
                          if (res.result.stats.updated > 0) {
                            console.log("更新库存成功");
                            resolve();
                          } else {
                            console.log("更新库存出错");
                          }
                        })

                      })
                    }
                  })
                }))
                Promise.all(promiseArr).then(() => {
                  let array = JSON.parse(JSON.stringify(this.data.orderList));
                  array.splice(index, 1);
                  this.setData({
                    orderList: array
                  })
                  wx.hideLoading();
                  wx.showToast({
                    title: '已取消',
                  })
                })
              }
            }
          })


        }
      }
    });
  },

  //跳转到商品详情
  toProDetail(e) {
    let pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: `../goods-details/goods-details?id=${pid}`,
    })
  },

  //获取用户已完成的订单
  _getAllOrder1() {
    order.getAllOrder1().then((res) => {
      if(res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let goodsNumber = 0;
          //更改时间格式
          let time = res[i].create_time.toLocaleString().split('GMT')[0];
          res[i].create_time = time;
          console.log('1111');
          console.log(res[i].create_time);
          //增加商品总数字段
          for (let j = 0; j < res[i].order_products.length; j++) {
            goodsNumber += res[i].order_products[j].order_quantity;
          }
          res[i].goodsNumber = goodsNumber;
        }
        this.setData({
          orderList: res
        })
        console.log('0000');
        console.log(this.data.orderList);
      }else{
        this.setData({
          orderList: []
        })
      }
    })
  },

  //获取用户进行中的订单
  _getAllOrder0() {
    order.getAllOrder0().then((res) => {
      if(res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let goodsNumber = 0;
          //更改时间格式
          let time = res[i].create_time.toLocaleString().split('GMT')[0];
          res[i].create_time = time;
          console.log('1111');
          console.log(res[i].create_time);
          //增加商品总数字段
          for (let j = 0; j < res[i].order_products.length; j++) {
            goodsNumber += res[i].order_products[j].order_quantity;
          }
          res[i].goodsNumber = goodsNumber;
        }
        this.setData({
          orderList: res
        })
        console.log('0000');
        console.log(this.data.orderList);
      }else{
        this.setData({
          orderList: []
        })
      }
    })
  },

  //点击进行中或已完成切换按钮
  statusTap(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentType: index
    })
    this.init(index);
  },

  //初始化数据
  init(type) {
    //获取用户id
    this.setData({
      openid: getApp().openid
    })
    if (type == '0') {
      this.setData({
        currentType: 0
      })
      this._getAllOrder0();
      console.log('进行中');
    } else if (type == '1') {
      this.setData({
        currentType: 1
      })
      this._getAllOrder1();
      console.log('已完成');
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单列表',
    })

    let type = options.type;
    this.init(type);
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
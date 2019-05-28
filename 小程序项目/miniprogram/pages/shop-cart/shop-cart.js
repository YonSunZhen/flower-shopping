// miniprogram/pages/shop-cart/shop-cart.js
const cart = require('../../api/order_cart.js');
const product = require('../../api/product_info.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    isLogin: false,
    openid: '',
    isDone: true
  },

  //点击编辑按钮
  editTap() {
    this.setData({
      isDone: false
    })
  },
  //点击完成按钮
  saveTap() {
    this.setData({
      isDone: true
    })
  },

  //增加选择的数量
  jiaBtnTap(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const product_surplus = e.currentTarget.dataset.order;
    if (this.data.goodsList[index].order_quantity < product_surplus) {
      var currentNum = this.data.goodsList[index].order_quantity;
      currentNum++;
      const str = `goodsList[${index}].order_quantity`;
      this.setData({
        [str]: currentNum
      })
    }
  },

  //减少选择的数量
  jianBtnTap(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    if (this.data.goodsList[index].order_quantity > 1) {
      var currentNum = this.data.goodsList[index].order_quantity;
      currentNum--;
      console.log(currentNum); 
      const str = `goodsList[${index}].order_quantity`;
      this.setData({
        [str]: currentNum
      })
    }
    // this.setData({
    //   buyNumber: this.data.buyNumber - 1
    // })
  },

  _getCartDetail(user_id) {
    cart.getCartByUserid(user_id).then((res) => {
      if(res.data.length > 0) {
        // wx.showLoading({
        //   title: '保存中',
        // })
        console.log(res);
        const productList = JSON.parse(JSON.stringify(res.data[0].cart_products));
        // this.setGoodsList(productList);
        console.log("购物车数据");
        console.log(productList);
        let promiseArr = [];
        for (let i = 0; i < productList.length; i++) {
          promiseArr.push(new Promise((resolve, reject) => {
            product.getOneProduct(productList[i].product_id).then((res) => {
              console.log('000000');
              console.log(res);
              //找不到数据
              if (res.length < 1) {
                productList[i].isDel = true;
                productList[i].active = false;
                // Object.assign(productList[i], res);
                console.log('商品已删除');
              } else if (res.product_state == 0) {
                productList[i].isDel = false;
                productList[i].active = false;
                Object.assign(productList[i], res[0]);
                console.log('商品已下架');
              } else {
                productList[i].isDel = false;
                productList[i].active = false;
                if (productList[i].order_quantity > res[0].product_surplus) {
                  productList[i].order_quantity = res[0].product_surplus;
                }
                Object.assign(productList[i], res[0]);
                console.log('111111');
                console.log(productList[i]);
              }
              resolve();
            })
          }))
        }

        Promise.all(promiseArr).then(() => {
          console.log('333333');
          console.log(productList);
          this.setData({
            goodsList: productList
          })
          console.log('22222222');
          console.log(this.data.goodsList);
        })
      }
    })
  },

  //设置模板数据
  setGoodsList(goodsList) {
    this.setData({
      goodsList: goodsList
    });
    console.log(this.data.isLogin);
    console.log(this.data.goodsList.length);
    console.log('-------');
    console.log(this.data.goodsList);
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
    console.log('页面加载');
    wx.setNavigationBarTitle({
      title: '购物车',
    })
    //必须先获取这两个数据
    this.setData({
      isLogin: getApp().isLogin,
      openid: getApp().openid
    })
    this._getCartDetail(this.data.openid);
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
    console.log('页面显示');
    this.setData({
      isLogin: getApp().isLogin,
      openid: getApp().openid
    })
    this._getCartDetail(this.data.openid);
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
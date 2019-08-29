const product = require('../../api/product_info.js');
const cart = require('../../api/order_cart.js');
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    productId: '',
    productDetail: {},
    isLogin: '',
    hideShopPopup: true, //下面的弹出框(默认不弹出)
    shopType: '', //用于区分弹框下面的是加入购物车还是立即购买(addShopCar和tobuy)
    buyNumber: 1, //弹框中选择的商品的数量
    buyNumMin: 1 //最少选择的数量(默认为1)
  },

  //点击立即购买按钮
  buyNow() {
    let goodSelected = [{
      product_id: this.data.productDetail._id,
      product_name: this.data.productDetail.product_name,
      img: this.data.productDetail.product_img,
      price: this.data.productDetail.price,
      order_quantity: this.data.buyNumber
    }]
    wx.setStorageSync('goodLists', goodSelected);
      wx.navigateTo({
        url: '../addOrder/addOrder',
      })
  },

  //前往购物车
  toCart() {
    wx.switchTab({
      url: '../shop-cart/shop-cart'
    })
  },

  //创建购物车
  addShopCar() {
    //先检查数据表中是否存在该用户的数据
    cart.isExist(this.data.openid).then((res) => {
      // console.log('--------');
      // console.log(res);
      //如果有的话先找出来然后再原有数据上增加
      if(res === "true"){
        wx.showLoading({
          title: '添加中',
        })
        cart.getCartByUserid(this.data.openid).then((res) => {
          
          // console.log("11111")
          // console.log(res);
          const id = res._id;
          const product_id = this.data.productId;
          const order_quantity = this.data.buyNumber;
          const price = this.data.productDetail.price;
          let oldCarts = res.data[0].cart_products;
          const test = oldCarts;
          // console.log('22222');
          // console.log(test);
          // console.log(product_id);
          // console.log(oldCarts);
          let state = 1;//(0相同产品,1不同产品)
          for (let i = 0; i < oldCarts.length; i++) {
            if (oldCarts[i].product_id === product_id) {
              state = 0;
            }else{
            }
          }

          if (state == 0) {
            let newCarts = JSON.parse(JSON.stringify(oldCarts));
            for (let i = 0; i < newCarts.length; i++) {
              if (oldCarts[i].product_id === product_id){
                newCarts[i].order_quantity = newCarts[i].order_quantity + order_quantity
                newCarts[i].add_time = db.serverDate();
              }
            }
            wx.cloud.callFunction({
              name: 'editCartByUid',
              data: {
                id: this.data.openid,
                newCarts: newCarts
              }
            }).then((res) => {
              // console.log('66666');
              // console.log(res);
              if (res.result.stats.updated > 0) {
                wx.hideLoading();
                wx.showToast({
                  title: '添加成功!'
                })
                //关闭弹框
                this.setData({
                  hideShopPopup: true
                })
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '添加失败!'
                })
                this.setData({
                  hideShopPopup: true
                })
              }
            })
          }else{
            let newCarts = JSON.parse(JSON.stringify(oldCarts));
            let newProduct = {
              product_id: product_id,
              order_quantity: order_quantity,
              _price: price,
              img: this.data.productDetail.product_img,
              name: this.data.productDetail.product_name,
              add_time: db.serverDate()
            }
            newCarts.push(newProduct);
            wx.cloud.callFunction({
              name: 'editCartByUid',
              data: {
                id: this.data.openid,
                newCarts: newCarts
              }
            }).then((res) => {
              // console.log('66666');
              // console.log(res);
              if (res.result.stats.updated > 0) {
                wx.hideLoading();
                wx.showToast({
                  title: '添加成功!'
                })
                this.setData({
                  hideShopPopup: true
                })
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '添加失败!'
                })
                this.setData({
                  hideShopPopup: true
                })
              }
            })
          }
        })
        console.log("已存在购物车");
      }else{//没有的话直接创建
        wx.showLoading({
          title: '添加中',
        })
        const user_id = this.data.openid;
        console.log("11111111111111111111");
        console.log(user_id);
        const product_id = this.data.productId;
        const order_quantity = this.data.buyNumber;
        const data = {
          user_id: user_id,
          cart_products: [
            {
              product_id: product_id,
              order_quantity: order_quantity,
              _price: this.data.productDetail.price,
              img: this.data.productDetail.product_img,
              name: this.data.productDetail.product_name,
              add_time: db.serverDate()
            }
          ],
          crteat_time: db.serverDate()
        }
        cart.addCart(data).then((res) => {
          if(res === 'true'){
            wx.hideLoading();
            wx.showToast({
              title: '添加成功',
            })
          }
        })
        console.log("还没有购物车");
      }
    })
  },

  //增加选择的数量
  numJiaTap() {
    if (this.data.buyNumber < this.data.productDetail.product_surplus) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },

  //减少选择的数量
  numJianTap() {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
    // this.setData({
    //   buyNumber: this.data.buyNumber - 1
    // })
  },

  //关闭弹框
  closePopupTap() {
    this.setData({
      hideShopPopup: true
    })
  },

  //获取商品详情
  _getProductDetail(product_id) {
    product.getOneProduct(product_id).then((res) => {
      const img = res[0].product_img;
      this.setData({
        productDetail: res[0],
        // fileIds: res.product_img,
        // files: this.data.files.concat(img), //拼接数组必须用这个concat返回一个新数组
        // oldFiles: this.data.oldFiles.concat(img)
      })
      // console.log('111111');
      // console.log(this.data.productDetail);
    })
  },

  //点击加入购物车按钮
  toAddShopCar() {
    if(!this.data.isLogin){
      console.log("未登录");
      wx.showModal({
        title: '',
        showCancel: true,
        content: '您还未登录,请先登录,是否前往登录界面?',
        success(res) {
          if (res.confirm) {
            //跳到tabBar页面
            wx.switchTab({
              url: '../my/my'
            })
            console.log('用户点击确定')
          } 
        }
      })
    }else{
      this.setData({
        hideShopPopup: false,
        shopType: 'addShopCar'
      })
      console.log("已登录");
    }
  },
  //点击加入立即购买按钮(弹出立即购买窗口)
  tobuy() {
    if(!this.data.isLogin){
      console.log("未登录");
      wx.showModal({
        title: '',
        showCancel: true,
        content: '您还未登录,请先登录,是否前往登录界面?',
        success(res) {
          if (res.confirm) {
            //跳到tabBar页面
            wx.switchTab({
              url: '../my/my'
            })
            console.log('用户点击确定');
          } 
        }
      })
    }else{
      this.setData({
        hideShopPopup: false,
        shopType: 'tobuy'
      })
      console.log("已登录");
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('页面加载');
    wx.setNavigationBarTitle({
      title: '商品详情'
    })
    this.setData({
      productId: options.id
    })

    this.setData({
      isLogin: getApp().isLogin
    })
    this.setData({
      openid: getApp().openid
    })
    console.log("000000000000");
    console.log(this.data.openid);
    this._getProductDetail(this.data.productId);
    // console.log(this.data.productId);
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
      isLogin: getApp().isLogin
    })
    this.setData({
      openid: getApp().openid
    })
    console.log("2222222222");
    console.log(this.data.openid);
    this._getProductDetail(this.data.productId);
    console.log('登录状态'+ this.data.isLogin);
    console.log('openid' + this.data.openid);
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
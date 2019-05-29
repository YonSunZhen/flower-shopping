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
    isDone: true,
    allSelect: true,
    totalPrice: 0
  },

  //点击删除按钮
  deleteSelected() {
    let array = [];
    let isSelect = 0;//(0表示都没选中,1表示最少选中1个)
    for (let i = 0; i < this.data.goodsList.length; i++) {
      if (!this.data.goodsList[i].checked) {
        array.push(this.data.goodsList[i]);
      }else{
        isSelect = 1;
      }
    }
    //判断是否有选中项目
    if (!isSelect) {
      wx.showToast({
        title: '您还未选择项目,请先选择',
        icon: 'none',
      })
    }else{
      wx.showLoading({
        title: '',
      })
      this.setData({
        goodsList: array
      })
      this.getTotalPrice();

      let newCarts = [];
      for (let i = 0; i < this.data.goodsList.length; i++) {
        let temp = this.data.goodsList[i];
        let obj = {
          "_price": temp._price,
          "add_time": temp.add_time,
          "img": temp.img,
          "name": temp.name,
          "order_quantity": temp.order_quantity,
          "product_id": temp.product_id
        }
        newCarts.push(obj);
      }

      wx.cloud.callFunction({
        name: 'editCartByUid',
        data: {
          id: this.data.openid,
          newCarts: newCarts
        }
      }).then((res) => {
        if (res.result.stats.updated > 0) {
          wx.hideLoading();
        } else {
          wx.hideLoading();
        }
      })

      // console.log('999999999');
      console.log(this.data.goodsList);
    }
  },

  //点击跳转到商品详情
  toProductDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../goods-details/goods-details?id=${id}`,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //统计总价格
  getTotalPrice() {
    let totalPrice = 0;
    for (let i = 0; i < this.data.goodsList.length; i++) {
      if (this.data.goodsList[i].product_state == 1) {
        if (this.data.goodsList[i].checked){
          totalPrice = totalPrice + (this.data.goodsList[i].price * this.data.goodsList[i].order_quantity);
        }
      }
    }
    this.setData({
      totalPrice: totalPrice
    })
  },

  //全选项目
  bindAllSelect() {
    if(this.data.allSelect) {
      for (let i = 0; i < this.data.goodsList.length; i++) {
        // if (this.data.goodsList[i].product_state == 1){
          
        // }
        if (this.data.goodsList[i].checked) {
          const str = `goodsList[${i}].checked`;
          this.setData({
            [str]: false,
            allSelect: false
          })
        }
      }
      this.getTotalPrice();
    }else{
      for (let i = 0; i < this.data.goodsList.length; i++) {
        // if (this.data.goodsList[i].product_state == 1) {
          
        // }
        if (!this.data.goodsList[i].checked) {
          const str = `goodsList[${i}].checked`;
          this.setData({
            [str]: true,
            allSelect: true
          })
        }
      }
      this.getTotalPrice();
    }
  },

  //选中项目
  selectTap(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const str = `goodsList[${index}].checked`;
    if (index !== "" && index != null){
      this.setData({
        [str]: !this.data.goodsList[index].checked
      })
    }
    this.getTotalPrice();
    // console.log(this.data.goodsList);
    //判断是否全选了
    let allSelectState = 1;//(1表示全选,0表示未全选)
    for(let i = 0; i < this.data.goodsList.length; i++) {
      // if(this.data.goodsList[i].product_state == 1) {
        
      // }
      if (!this.data.goodsList[i].checked) {
        allSelectState = 0;
      }
    }
    if(allSelectState == 0) {
      this.setData({
        allSelect: false
      })
    }else{
      this.setData({
        allSelect: true
      })
    }
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
      wx.showLoading({
        title: '',
      })
      var currentNum = this.data.goodsList[index].order_quantity;
      currentNum++;
      const str = `goodsList[${index}].order_quantity`;
      this.setData({
        [str]: currentNum
      })
      this.getTotalPrice();

      let newCarts = [];
      for (let i = 0; i < this.data.goodsList.length; i++) {
        let temp = this.data.goodsList[i];
        let obj = {
          "_price": temp._price,
          "add_time": temp.add_time,
          "img": temp.img,
          "name": temp.name,
          "order_quantity": temp.order_quantity,
          "product_id": temp.product_id
        }
        newCarts.push(obj);
      }

      wx.cloud.callFunction({
        name: 'editCartByUid',
        data: {
          id: this.data.openid,
          newCarts: newCarts
        }
      }).then((res) => {
        if (res.result.stats.updated > 0) {
          wx.hideLoading();
        } else {
          wx.hideLoading();
        }
      })
    }
  },

  //减少选择的数量
  jianBtnTap(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    if (this.data.goodsList[index].order_quantity > 1) {
      wx.showLoading({
        title: '',
      })
      var currentNum = this.data.goodsList[index].order_quantity;
      currentNum--;
      // console.log(currentNum); 
      const str = `goodsList[${index}].order_quantity`;
      this.setData({
        [str]: currentNum
      })
      this.getTotalPrice();
      let newCarts = [];
      for(let i = 0; i < this.data.goodsList.length; i++) {
        let temp = this.data.goodsList[i];
        let obj = {
          "_price": temp._price,
          "add_time": temp.add_time,
          "img": temp.img,
          "name": temp.name,
          "order_quantity": temp.order_quantity,
          "product_id": temp.product_id
        }
        newCarts.push(obj);
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
          // wx.showToast({
          //   title: '添加成功!'
          // })
        } else {
          wx.hideLoading();
          // wx.showToast({
          //   title: '添加失败!'
          // })
        }
      })


    }else{
      wx.showToast({
        title: '最少购买一件哦!',
        icon: 'none',
      })
    }
  },

  _getCartDetail(user_id) {
    cart.getCartByUserid(user_id).then((res) => {
      if(res.data.length > 0) {
        wx.showLoading({
          title: '加载中',
        })
        console.log(res);
        const productList = JSON.parse(JSON.stringify(res.data[0].cart_products));
        // this.setGoodsList(productList);
        console.log("购物车数据");
        console.log(productList);
        let promiseArr = [];
        for (let i = 0; i < productList.length; i++) {
          promiseArr.push(new Promise((resolve, reject) => {
            product.getOneProduct(productList[i].product_id).then((res) => {
              // console.log('000000');
              // console.log(res);
              //找不到数据
              if (res.length < 1) {
                productList[i].product_state = 0;
                productList[i].checked = false;
                // Object.assign(productList[i], res);
                console.log('商品已删除');
              } else if (res[0].product_state == 0) {
                // productList[i].isDel = false;
                productList[i].checked = false;
                Object.assign(productList[i], res[0]);
                console.log('商品已下架');
              } else {
                // productList[i].isDel = false;
                productList[i].checked = true;
                if (productList[i].order_quantity > res[0].product_surplus) {
                  productList[i].order_quantity = res[0].product_surplus;
                }
                Object.assign(productList[i], res[0]);
                
              }
              resolve();
            })
          }))
        }

        Promise.all(promiseArr).then(() => {
          // console.log('333333');
          // console.log(productList);
          this.setData({
            goodsList: productList
          })
          console.log('111111');
          console.log(this.data.goodsList);
          this.getTotalPrice();
          //初始化allSelect
          for(let i = 0; i < this.data.goodsList.length; i++) {
            if(!this.data.goodsList[i].checked) {
              this.setData({
                allSelect: false
              })
              console.log('222222');
            }
          }
          console.log('333333');
          console.log(this.data.allSelect);
          wx.hideLoading();
          // console.log('22222222');
          // console.log(this.data.goodsList);
        })
      }
    })
  },

  //设置模板数据
  setGoodsList(goodsList) {
    this.setData({
      goodsList: goodsList
    });
    // console.log(this.data.isLogin);
    // console.log(this.data.goodsList.length);
    // console.log('-------');
    // console.log(this.data.goodsList);
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
    // this.getTotalPrice();
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
      allSelect: true
    })
    
    this.setData({
      isLogin: getApp().isLogin,
      openid: getApp().openid
    })
    this._getCartDetail(this.data.openid);
    // this.getTotalPrice();
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
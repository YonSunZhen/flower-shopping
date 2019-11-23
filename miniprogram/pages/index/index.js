//index.js
const categroy = require('../../api/product_categroy.js');
const product = require('../../api/product_info.js');
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    inputVal: '',
    inputShowed: false, // 是否显示搜索框,
    inputVal: '',


    categroyList: [], // 商品类型列表
    productList: [], // 商品列表
    productRecommend: [],
    selectId: 0 //用于切换选择类型时的颜色(默认选中第一个类别)
  },

  //点击选择类型时
  selectCategroy(e) {
    const categroyId = e.currentTarget.dataset.categroyid;
    product.getProductsByCateId(categroyId).then((res) => {
      this.setData({
        productList: res.data
      })
      for (let i = 0; i < this.data.categroyList.length; i++) {
        if (this.data.categroyList[i]._id === categroyId) {
          this.setData({
            selectId: i
          })
        }
      }
    })
  },

  // 根据类型id获取商品
  getProductsById(categroyId) {
    product.getProductsByCateId(categroyId).then((res) => {
      this.setData({
        productList: res.data
      })
      for (let i = 0; i < this.data.categroyList.length; i++) {
        if (this.data.categroyList[i]._id === categroyId) {
          this.setData({
            selectId: i
          })
        }
      }
    })
  },

  // 获取第一种类型的商品(升序排列)(最先上传的最先显示)
  _getProductByFirstCate() {
    wx.showLoading({
      title: '加载中',
    })
    const categroyId = this.data.categroyList[0]._id;
    product.getProductsByCateId(categroyId).then((res) => {
      this.setData({
        productList: res.data
      })
      for (let i = 0; i < this.data.categroyList.length; i++) {
        if (this.data.categroyList[i]._id === categroyId) {
          this.setData({
            selectId: i
          })
        }
      }
      wx.hideLoading();
    })
  },

  //获得推荐的商品(爆品推荐)
  _getProductRecommend(limit) {
    product.getProductsBySale(limit).then(res => {
      this.setData({
        productRecommend: res.data
      })
    })
  },


  //获取所有商品的数据(商品列表)
  _getAllProduct(pageIndex, pageSize) {
    wx.showLoading({
      title: '加载中',
    })
    product.getProductsByState(pageIndex, pageSize).then(res => {
      this.setData({
        productList: res.data
      })
      wx.hideLoading();
    })
  },

  //获取所有类型
  _getAllCategroy: function () {
    return new Promise((resolve, reject) => {
      categroy.getAllCategroy().then((res) => {
        this.setData({
          categroyList: res.data
        })
        resolve();
      })
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  toSearch: function(e) {
  },

  toDetailsTap: function(e) {
    const id = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: `../goods-details/goods-details?id=${id}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
 
  onLoad: function() {
    this._getAllCategroy().then(res => {
      // 首次加载默认获取第一种类型的商品
      this._getProductByFirstCate();
    });
    //分页获取数据暂时没弄
    // this._getAllProduct(1,100);
    //默认先获取两条数据(爆品推荐)
    // this._getProductRecommend(2);
  },

  //监听页面显示
  onShow: function() {
    let tempCatId = wx.getStorageSync('categroyId');
    if (tempCatId) {
      this.setData({
        selectId: tempCatId
      })
    }
    this._getAllCategroy().then(res => {
      let tempId = this.data.categroyList[this.data.selectId]._id;
      this.getProductsById(tempId);
    });
    //分页获取数据暂时没弄
    // this._getAllProduct(1, 100);
    //默认先获取两条数据(爆品推荐)
    // this._getProductRecommend(2);
  },

  //当页面隐藏时
  onHide() {
    wx.setStorageSync('categroyId', this.data.selectId);
  }

})

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


    categroyList: [],
    productList: [],
    productRecommend: [],
    selectId: -1 //用于切换选择类型时的颜色(默认不选中)
  },

  //点击选择类型时
  selectCategroy(e) {
    console.log(e);
    const categroyId = e.currentTarget.dataset.categroyid;
    // console.log(categroyId);
    product.getProductsByCateId(categroyId).then((res) => {
      this.setData({
        productList: res.data
      })
      // console.log('222222');
      // console.log(this.data.categroyList);
      for (let i = 0; i < this.data.categroyList.length; i++) {
        if (this.data.categroyList[i]._id === categroyId) {
          // console.log('111111111');
          this.setData({
            selectId: i
          })
        }
      }
    })
  },

  //获得推荐的商品(爆品推荐)
  _getProductRecommend(limit) {
    product.getProductsBySale(limit).then(res => {
      this.setData({
        productRecommend: res.data
      })
      console.log("---------");
      console.log(this.data.productRecommend);
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
      console.log(this.data.productList);
      wx.hideLoading();
    })
  },

  //获取所有类型
  _getAllCategroy: function () {
    categroy.getAllCategroy().then((res) => {
      this.setData({
        categroyList: res.data
      })
      // console.log(this.data.categroyList);
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
    console.log(e.detail.value);
  },

  toDetailsTap: function(e) {
    const id = e.currentTarget.dataset.productid;
    console.log(id);
    wx.navigateTo({
      url: `../goods-details/goods-details?id=${id}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
 
  onLoad: function() {
    this._getAllCategroy();
    //分页获取数据暂时没弄
    this._getAllProduct(1,100);
    //默认先获取两条数据(爆品推荐)
    this._getProductRecommend(2);
  },

  //监听页面显示
  onShow: function() {
    this._getAllCategroy();
    //分页获取数据暂时没弄
    this._getAllProduct(1, 100);
    //默认先获取两条数据(爆品推荐)
    this._getProductRecommend(2);
  },

  //当页面隐藏时
  onHide() {
    this.setData({
      selectId: -1
    })
  }

})

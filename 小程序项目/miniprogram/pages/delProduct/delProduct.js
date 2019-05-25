// miniprogram/pages/delProduct/delProduct.js
const product = require('../../api/product_info.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productItems: [],
    selectedProduct: [],
    pageIndex: 1, //当前页数
    pageSize: 12 //滚动到底部每次加载的商品数据
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    this.setData({
      selectedProduct: e.detail.value
    })
    var checkboxItems = this.data.productItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i]._id == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    // console.log(checkboxItems);

    this.setData({
      productItems: checkboxItems
    });
  },

  //获取所有商品的数据
  //state参数用于区分是否累加productItems
  _getAllProduct(pageIndex, pageSize, state) {
    wx.showLoading({
      title: '加载中',
    })
    product.getAllProduct(pageIndex, pageSize).then(res => {
      if(state){
        this.setData({
          productItems: this.data.productItems.concat(res.data)
        })
      }else{
        this.setData({
          productItems: res.data
        })
      }
      wx.hideLoading();
    })
  },

  //点击删除按钮
  delProduct(e) {
    if (this.data.selectedProduct.length < 1) {
      wx.showModal({
        content: '您还未选中要删除的项目,请选择',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定');
          }
        }
      });
    } else {
      wx.showModal({
        content: '确定删除吗',
        showCancel: true,
        success: res => {
          if (res.confirm) {
            // this._getAllCategroy();
            wx.showLoading({
              title: '删除中'
            })
            let promiseArr = [];
            for (let i = 0; i < this.data.selectedProduct.length; i++) {
              promiseArr.push(new Promise((resolve, reject) => {
                const _id = this.data.selectedProduct[i];
                wx.cloud.callFunction({
                  name: 'delProduct',
                  data: {
                    _id: _id
                  }
                }).then(res => {
                  // console.log("成功删除一个商品");
                  if (res.result.stats.removed > 0) {
                    resolve("true");
                  }
                }) 
              }));
            };
            Promise.all(promiseArr).then((res) => {
              //删除数据时重新回到一开始进入页面的时候
              this.setData({
                pageIndex: 1,
                pageSize: 12
              })
              this._getAllProduct(this.data.pageIndex, this.data.pageSize,false);
              wx.hideLoading();
              wx.showToast({
                title: '删除成功!'
              })
            })
          }
        }
      });
    }
  },

  //点击编辑按钮跳转
  editProduct(e) {
    const id = e.target.dataset.id;
    // console.log(e);
    console.log(id);
    wx.navigateTo({
      url: `../editProduct/editProduct?id=${id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '删除商品',
    })
    this._getAllProduct(this.data.pageIndex,this.data.pageSize,true);
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
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    console.log('pageIndex' + this.data.pageIndex);
    this._getAllProduct(this.data.pageIndex, this.data.pageSize,true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
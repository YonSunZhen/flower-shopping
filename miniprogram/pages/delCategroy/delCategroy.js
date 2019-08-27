// pages/editCategroy/editCategroy.js
const categroy = require('../../api/product_categroy.js');
const product = require('../../api/product_info.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categroyItems: [ ],
    selectedCategroy: [ ]//已选中的分类id 
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    this.setData({
      selectedCategroy: e.detail.value
    })
    var checkboxItems = this.data.categroyItems, values = e.detail.value;
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
      categroyItems: checkboxItems
    });
    // console.log(this.data.selectedCategroy);
  },

  editCategroy(e) {
    const id = e.target.dataset.id;
    // console.log(e);
    console.log(id);
    wx.navigateTo({
      url: `../editCategroy/editCategroy?id=${id}`,
    })
  },

  //获取所有类型的数据
  _getAllCategroy() {
    categroy.getAllCategroy().then(res => {
      this.setData({
        categroyItems: res.data
      })
      // console.log(res);
    })
  },

  //删除类型
  delCategroy() {
    // console.log("11111");
    if(this.data.selectedCategroy.length < 1) {
      // console.log("-------");
      wx.showModal({
        content: '您还未选中要删除的项目,请选择',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定');
          }
        }
      });
    }else{
      wx.showModal({
        content: '确定删除吗(此类型的商品将被删除)',
        showCancel: true,
        success: res => {
          if (res.confirm) {
            // this._getAllCategroy();
            wx.showLoading({
              title: '删除中'
            })
            let promiseArr = [];
            for (let i = 0; i < this.data.selectedCategroy.length; i++) {
              promiseArr.push( new Promise((resolve,reject) => {
                const _id = this.data.selectedCategroy[i];
                //删除这种类型的商品
                product.isExist(_id).then((res) => {
                  //先判断是否有商品,有的话删除商品然后删除类型
                  if (res === "true") {
                    wx.cloud.callFunction({
                      name: 'delProductByCid',
                      data: {
                        categroy_id: _id
                      }
                    }).then( (res) => {
                      if (res.result.stats.removed > 0) {
                        //删除类型
                        wx.cloud.callFunction({
                          name: 'delCategroy',
                          data: {
                            _id: _id
                          }
                        }).then(res => {
                          console.log("成功删除一条类型(有商品)");
                          resolve();
                        })
                      }
                      // resolve();
                    })
                  } else {//直接删除类型
                    wx.cloud.callFunction({
                      name: 'delCategroy',
                      data: {
                        _id: _id
                      }
                    }).then((res) => {
                      console.log("成功删除一条类型(无商品)");
                      resolve();
                    })
                  }
                })
              }));
            };
            Promise.all(promiseArr).then((res) => {
              wx.hideLoading();
              wx.showToast({
                title: '删除成功!'
              })
              this._getAllCategroy();
            })
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '编辑类型',
    })
    this._getAllCategroy();
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
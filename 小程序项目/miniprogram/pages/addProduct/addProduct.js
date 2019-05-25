// pages/addProduct/addProduct.js
const db = wx.cloud.database();
const categroy = require('../../api/product_categroy.js');
const product = require('../../api/product_info.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categroyList: [{"id":1,"name":"鲜花"},{"id":2,"name":"蔬菜"}],//所有的类型
    showCategroyStr: '请选择类型',
    statusList: ['下架','上架'],//商品状态的值
    showStatusStr: '请选择状态',
    product_img: '',
    files: [] //暂时存放的数组
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      //表示一次选择的图片的数量
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //只能上传一张图片
        if (that.data.files.length > 0) {
          wx.showModal({
            content: '只能上传一张图片',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定');
              }
            }
          });
        } else {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            files: that.data.files.concat(res.tempFilePaths)
          });
        }
      }
    })
  },
  //用于点击图片展示大图
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  //取消图片的上传
  deleteImage: function (e) {
    var that = this;
    var images = that.data.files;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '系统提醒',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          //删除一项(数组下标为index的)
          images.splice(index, 1);
        } else if (res.cancel) {
          return false;
        }
        that.setData({
          files: images
        });
      }
    })
  },

  //当选择器的选项发生改变时触发
  bindCategroyChange: function(e) {
    const selectCategroy = this.data.categroyList[e.detail.value];
    this.setData({
      showCategroyStr: selectCategroy.categroy_name
    })
    // console.log(selectCategroy);
  },

  bindStatusChange: function(e) {
    const selectStatus = this.data.statusList[e.detail.value];
    this.setData({
      showStatusStr: selectStatus
    })
    // console.log(e.detail.value);
  },

  bindSave: function(e) {
    wx.showLoading({
      title: '保存中',
    })
    let promiseArr = [];
    for (let i = 0; i < this.data.files.length; i++) {
      promiseArr.push(new Promise((resolve, reject) => {
        let item = this.data.files[i];
        let suffix = /\.\w+$/.exec(item)[0];//正则返回文件的扩展名
        //将图片上传至服务器
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // console.log(res);
            //记录服务器中图片的云id(路径)
            this.setData({
              product_img: res.fileID
            });
            resolve();
          },
          fail: console.error
        })
      }));
    }

    //传入promise数组，等所有的promise执行完在执行里面的方法
    Promise.all(promiseArr).then(res => {
      // console.log(e.detail);
      const productName = e.detail.value.productName;
      const productPrice = Number(e.detail.value.productPrice);
      const productCategroyName = this.data.categroyList[e.detail.value.productCategroy].categroy_name;
      const productCategroyId = this.data.categroyList[e.detail.value.productCategroy]._id;
      const productCount = Number(e.detail.value.productCount);
      const productRemark = e.detail.value.productRemark;
      const productState = Number(e.detail.value.productState);
      const productDescript = e.detail.value.productDescript;
      // console.log(productCategroyName);
      const data = {
        product_name: productName,
        categroy_id: productCategroyId,
        price: productPrice,
        product_img: this.data.product_img,
        product_count: productCount,
        product_surplus: productCount,
        product_descript: productDescript,
        product_state: productState,
        product_remark: productRemark,
        publish_time: db.serverDate()
      }
      product.addProduct(data).then(res => {
        if (res === "true") {
          wx.hideLoading();
          wx.showToast({
            title: '保存成功!'
          })
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '保存失败!'
          })
        }
      })
    })

  },

  //获取所有类型
  _getAllCategroy: function() {
    categroy.getAllCategroy().then((res) => {
      this.setData({
        categroyList: res.data
      })
      // console.log('-----');
      // console.log(res);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '添加商品',
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
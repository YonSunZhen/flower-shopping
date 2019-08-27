// pages/editProduct/editProduct.js
const product = require('../../api/product_info.js');
const categroy = require('../../api/product_categroy.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product_id: '',
    categroyList: [],
    productDetail: {},
    product_img: '',
    files: [], //暂时存放的数组
    stateList: ['下架', '上架'],//商品状态的值
    showCategroyStr: '请选择类型',
    showStateStr: '请选择状态',
    categroyVal: '',//表示选择了类型列表中的第几个（下标从 0 开始）
    oldFiles: []//表示原来已经上传的图片，对比使用的(如果图片没变的话就取消上传图片到服务器的步骤)
  },

  //当选择器的选项发生改变时触发
  bindCategroyChange: function (e) {
    const selectCategroy = this.data.categroyList[e.detail.value];
    this.setData({
      showCategroyStr: selectCategroy.categroy_name
    })
    // console.log(selectCategroy);
  },

  bindStateChange: function (e) {
    const selectState = this.data.stateList[e.detail.value];
    this.setData({
      showStateStr: selectState
    })
    // console.log(e.detail.value);
  },

  //初始化数据(按顺序执行)
  init() {
    let promiseArray = [];
    promiseArray.push(this._getProductDetail(this.data.product_id), this._getAllCategroy());
    Promise.all(promiseArray).then(()=> {
      this.initCateStat();
    })  
  },

  //获取所有类型
  _getAllCategroy: function () {
    return new Promise((resolve,reject) => {
      categroy.getAllCategroy().then((res) => {
        this.setData({
          categroyList: res.data
        })
        // console.log(this.data.categroyList);
        resolve();
      })
    })
  },

  _getProductDetail(product_id){
    return new Promise((resolve,reject) => {
      product.getOneProduct(product_id).then((res) => {
        const img = res[0].product_img;
        this.setData({
          productDetail: res[0],
          fileIds: res[0].product_img,
          files: this.data.files.concat(img), //拼接数组必须用这个concat返回一个新数组
          oldFiles: this.data.oldFiles.concat(img)
        })
        console.log(res);
        resolve()
      })
    })
  },

  //初始化类型和状态
  initCateStat() {
    return new Promise((resolve,reject) => {
      //初始化类型
      if (this.data.productDetail.categroy_id !== '') {
        //找出这个类型id是在categroyList中的第几个元素
        for (let i = 0; i < this.data.categroyList.length; i++) {
          if (this.data.categroyList[i]._id == this.data.productDetail.categroy_id) {
            this.setData({
              categroyVal: i
            })
            this.setData({
              showCategroyStr: this.data.categroyList[i].categroy_name
            })
          } else {
            resolve();
          }
        }
        // console.log(this.data.categroyVal);
      } else {
        resolve();
      }
      //初始化状态
      if (this.data.productDetail.product_state !== '') {
        for (let i = 0; i < this.data.stateList.length; i++) {
          if (this.data.productDetail.product_state == i) {
            this.setData({
              showStateStr: this.data.stateList[i]
            })
            console.log(this.data.showStateStr);
          }else{
          }
        }
      }
      resolve();
    })
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
                // console.log(that.data.files);
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

  bindSave(e) {

    wx.showLoading({
      title: '保存中',
    })
    let promiseArr = [];
    //暂时只能用于比较数组中只有一项元素
    if (this.data.files.toString() === this.data.oldFiles.toString()) {
      promiseArr.push(new Promise((resolve, reject) => {
        console.log("没有改图");
        resolve()
      }))
    } else {
      console.log("改图了");
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
                fileIds: res.fileID
              });
              resolve();
            },
            fail: console.error
          })
        }));
      }
    }


    //传入promise数组，等所有的promise执行完在执行里面的方法
    Promise.all(promiseArr).then(res => {
      const productName = e.detail.value.productName;
      const productPrice = Number(e.detail.value.productPrice);
      const productCategroyName = this.data.categroyList[e.detail.value.productCategroy].categroy_name;
      const productCategroyId = this.data.categroyList[e.detail.value.productCategroy]._id;
      const productCount = Number(e.detail.value.productCount);
      const productRemark = e.detail.value.productRemark;
      const productState = Number(e.detail.value.productState);
      const productDescript = e.detail.value.productDescript;
      const data = {
        product_name: productName,
        categroy_id: productCategroyId,
        price: productPrice,
        product_img: this.data.fileIds,
        product_count: productCount,
        product_surplus: productCount,
        product_descript: productDescript,
        product_state: productState,
        product_remark: productRemark,
      }
      // console.log(data);
      wx.cloud.callFunction({
        name: 'editProduct',
        data: {
          id: this.data.product_id,
          data: data
        }
      }).then((res) => {
        if (res.result.stats.updated > 0) {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '编辑商品',
    })
    this.setData({
      product_id: options.id
    })
    console.log(this.data.product_id);
    // this._getProductDetail(this.data.product_id);
    // this._getAllCategroy();
    // this.initCateStat();
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
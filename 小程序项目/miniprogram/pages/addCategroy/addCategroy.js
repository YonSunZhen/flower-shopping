// pages/addCategroy/addCategroy.js
const categroy = require('../../api/product_categroy.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    fileIds: '',
    categroyName: ''
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
                console.log('用户点击确定');
                console.log(that.data.files);
              }
            }
          });
        }else{
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            files: that.data.files.concat(res.tempFilePaths)
          });
          console.log(that.data.files);
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
  deleteImage: function(e) {
    var that = this;
    var images = that.data.files;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '系统提醒',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
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

  bindSave: function(e) {
    const categroyName = e.detail.value.categroyName;
    this.setData({
      categroyName: categroyName
    })
    // console.log('1111');
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
            console.log("111111111111");
            console.log(res);
            this.setData({
              fileIds: res.fileID
            });
            resolve();
          },
          fail: console.error
        })
      }));
    }

    //传入promise数组，等所有的promise执行完在执行里面的方法
    Promise.all(promiseArr).then(res => {
      console.log("2222222");
      console.log(this.data.files);
      console.log("33333");
      console.log(this.data.fileIds);
      // const imgUrl = this.data.files;
      const data = {
        categroy_name: this.data.categroyName,
        imgUrl: this.data.fileIds
      }
      categroy.addCategroy(data).then(res => {
        if(res === "true"){
          wx.hideLoading();
          wx.showToast({
            title: '保存成功!'
          })
        }else {
          wx.hideLoading();
          wx.showToast({
            title: '保存失败!'
          })
        }
      })
      // console.log(e.detail.value.categroyName);
      // console.log(imgUrl);
      // console.log('----------');
      // console.log(this.data.fileIds);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '添加类型',
    })
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
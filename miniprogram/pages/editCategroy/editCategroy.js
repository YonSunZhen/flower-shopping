// pages/editCategroy/editCategroy.js
const categroy = require('../../api/product_categroy.js');
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categroy_id: '',
    categroy_name: '',
    fileIds: '',
    files: [ ],
    oldFiles: [ ]//表示原来已经上传的图片，对比使用的(如果图片没变的话就取消上传图片到服务器的步骤)
  },

  //获取类型详情
  getDetail: function(id) {
    categroy.getOneCategroy(id).then((res) => {
      const img = res.categroy_img;
      this.setData({
        categroy_name: res.categroy_name,
        fileIds: res.categroy_img,
        files: this.data.files.concat(img), //拼接数组必须用这个concat返回一个新数组
        oldFiles: this.data.oldFiles.concat(img)
      })
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

  bindSave: function (e) {
    const categroyName = e.detail.value.categroyName;
    this.setData({
      categroy_name: categroyName
    })
    wx.showLoading({
      title: '保存中',
    })
    let promiseArr = [];
    //暂时只能用于比较数组中只有一项元素
    if (this.data.files.toString() === this.data.oldFiles.toString()) {
      promiseArr.push(new Promise((resolve,reject) => {
        resolve();
      }))
    }else {
      for (let i = 0; i < this.data.files.length; i++) {
        promiseArr.push(new Promise((resolve, reject) => {
          let item = this.data.files[i];
          let suffix = /\.\w+$/.exec(item)[0];//正则返回文件的扩展名
          //将图片上传至服务器
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
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
      const data = {
        categroy_name: this.data.categroy_name,
        categroy_img: this.data.fileIds
      }
      wx.cloud.callFunction({
        name: 'editCategroy',
        data: {
          id: this.data.categroy_id,
          data: data
        }
      }).then((res) => {
        if (res.result.stats.updated > 0) {
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
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '编辑类型',
    })
    this.setData({
      categroy_id: options.id
    })
    this.getDetail(this.data.categroy_id);
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
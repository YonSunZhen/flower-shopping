// pages/select-address/select-address.js
const user = require('../../api/user_info.js');
const address = require('../../api/user_addr.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    openid: '',
    addressList: [],
    idList: []
  },

  //切换是否选中
  selectTap(e) {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    if (this.data.addressList[index].isSelected) {
      wx.showToast({
        title: '已选中',
      })
    }else{
      wx.showLoading({
        title: '',
      })
      const str = `addressList[${index}].isSelected`;
      //将选中的那一项的isSelected设为true
      this.setData({
        [str]: true
      })
      //将其他项的isSelected设为false
      for(let i = 0; i < this.data.addressList.length; i++) {
        if(i != index) {
          this.setData({
            [`addressList[${i}].isSelected`]: false
          })
        }
      }
      //将更改的数据存进数据库
      let promiseArr = [];
      for(let i = 0; i < this.data.addressList.length; i++) {
        let data = {
          isSelected: this.data.addressList[i].isSelected
        }
        promiseArr.push(new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: 'editAddress',
            data: {
              id: this.data.addressList[i]._id,
              data: data
            }
          }).then((res) => {
            // if (res.result.stats.updated > 0) {
            //   resolve();
            // } else {
            //   reject();
            // }
            resolve();
          })
        }))
      }
      Promise.all(promiseArr).then(() => {
        wx.hideLoading();
        wx.showToast({
          title: '保存成功!',
        })
      })
    }
  },

  editAddess(e) {
    const type = 'edit';
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../add-address/add-address?type=${type}&id=${id}`
    })
  },
  
  //获取用户地址列表
  _getAddressList() {
    user.getAddressId(this.data.openid).then((res) => {
      this.setData({
        idList: res
      })
    }).then(() => {
      let promiseArr = [];
      let temp = [];
      for(let i = 0; i < this.data.idList.length; i++) {
        promiseArr.push(new Promise((resolve, reject) => {
          address.getAddressDetail(this.data.idList[i]).then((res) => {
            temp.push(res);
            resolve();
          })
        }))
      }
      Promise.all(promiseArr).then(() => {
        this.setData({
          addressList: temp
        })
      })
    })
  },

  addAddress: function () {
    const type = 'add';
    wx.navigateTo({
      url: `../add-address/add-address?type=${type}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选择收货地址',
    })

    this.setData({
      isLogin: getApp().isLogin,
      openid: getApp().openid
    })

    this._getAddressList();
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
    this._getAddressList();
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
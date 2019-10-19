// pages/add-address/add-address.js
const address = require('../../api/user_addr.js');
const user = require('../../api/user_info.js');
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    openid: '',
    type: '',
    consignee_name: '',
    consignee_phone: '',
    address_detail: '',
    remark: '',
    address_id: '',//增加用户地址时返回来的id(后台生成的那个)
    old_addressId: [],
    new_addressId: [],
    addressDetail: {},
    addressId: '',//用户点击编辑按钮时传过来的id
    // user_address_id: [] //用户的地址id数组
  },

  deleteAddress() {
    //获取该用户的user_address_id
    user.getAddressId(this.data.openid).then((res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i] == this.data.addressId) {
          res.splice(i,1)
        }
      }
      wx.cloud.callFunction({
        name: 'editUserAddr',
        data: {
          id: this.data.openid,
          data: {
            user_address_id: res
          }
        }
      }).then(() => {
        wx.cloud.callFunction({
          name: 'delAddress',
          data: {
            id: this.data.addressId
          }
        }).then(res => {
          if (res.result.stats.removed > 0) {
            // resolve("true");
            wx.hideLoading();
            wx.showToast({
              title: '删除成功',
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })

      })
    })
  },
 


  //获取地址详情
  _getAddressDetail(id) {
    address.getAddressDetail(id).then((res) => {
      this.setData({
        addressDetail: res
      })
    })
  },

  bindSave(e) {
    const user_id = this.data.openid;
    const consignee_name = e.detail.value.consignee_name;
    const consignee_phone = e.detail.value.consignee_phone;
    const address_detail = e.detail.value.address_detail;
    const remark = e.detail.value.remark;

    if (consignee_name == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (consignee_phone == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (address_detail == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    const data = {
      user_id: user_id,
      consignee_name: consignee_name,
      consignee_phone: consignee_phone,
      address_detail: address_detail,
      remark: remark,
      add_time: db.serverDate(),
      isSelected: false
    };
    if(this.data.type == 'add') {
      wx.showLoading({
        title: '保存中',
      })
      //获取原来用户的地址数组-将数据增加到address表-更新用户表中用户的数据
      //第一个添加的地址默认为选中,后面的默认不选中
      user.getAddressId(this.data.openid).then((res) => {
        // const old_addressId = res;
        if (res.length < 1) {
          data.isSelected = true;
          // old_addressId.push(this.data.address_id);
          this.setData({
            old_addressId: res
          })
        } else {
          data.isSelected = false;
          // old_addressId.push(this.data.address_id);
          this.setData({
            old_addressId: res
          })
        }
      }).then(() => {
        address.addAddress(data).then((res) => {
          const array = this.data.old_addressId;
          array.push(res);
          this.setData({
            address_id: res,
            new_addressId: array
          })
        }).then(() => {
          const data1 = {
            user_address_id: this.data.new_addressId
          }
          wx.cloud.callFunction({
            name: 'editUserAddr',
            data: {
              id: this.data.openid,
              data: data1
            }
          }).then((res) => {
            if (res.result.stats.updated > 0) {
              wx.hideLoading();
              wx.showToast({
                title: '保存成功!'
              })
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '保存失败!'
              })
              wx.navigateBack({
                delta: 1
              })
            }
          })
        })
      })
    } else if(this.data.type == 'edit') {
      const obj = this.data.addressDetail;
      if (consignee_name == obj.consignee_name && consignee_phone == obj.consignee_phone && address_detail == obj.address_detail && remark == obj.remark) {
        wx.showModal({
          title: '提示',
          content: '您还未做任何修改,请先修改!',
          showCancel: false
        })
        return
      }else{
        wx.showLoading({
          title: '保存中',
        })
        wx.cloud.callFunction({
          name: 'editAddress',
          data: {
            id: this.data.addressId,
            data: data
          }
        }).then((res) => {
          if (res.result.stats.updated > 0) {
            wx.hideLoading();
            wx.showToast({
              title: '保存成功!'
            })
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '保存失败!'
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    }


  },

  //初始化数据
  ininData(type,id) {
    //一种type是add,一种是edit
    if (type == 'add') {
      wx.setNavigationBarTitle({
        title: '新增地址',
      })
      this.setData({
        type: type
      })
    } else if (type == 'edit') {
      wx.setNavigationBarTitle({
        title: '修改地址',
      })
      this.setData({
        type: type,
        addressId: id
      })
      this._getAddressDetail(id);
    }
    this.setData({
      isLogin: getApp().isLogin,
      openid: getApp().openid
    })
    console.log('用户id（载入页面）' + this.data.openid);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type;
    const id = options.id;
    this.ininData(type,id);

    
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
    // this.setData({
    //   isLogin: getApp().isLogin,
    //   openid: getApp().openid
    // })

    console.log('用户id（显示页面）');
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
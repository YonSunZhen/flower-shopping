const db = wx.cloud.database();
//增加地址
const addAddress = (data) => {
  return new Promise((resolve, reject) => {
    db.collection('user_addr').add({
      data: data
    }).then(res => {
      if (res._id) {
        resolve(res._id);
      } else {
        resolve("flase");
      }
    }).catch(err => {
      resolve(err);
    })
  })
}
//根据id查找地址详情
const getAddressDetail = (id) => {
  return new Promise((resolve, reject) => {
    db.collection('user_addr').doc(id).get().then(res => {
      resolve(res.data);
    })
  })
}


module.exports = {
  addAddress,
  getAddressDetail
}
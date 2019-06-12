const db = wx.cloud.database();

//增加一条购物车数据
const addOrder = (data) => {
  return new Promise((resolve, reject) => {
    db.collection('order_info').add({
      data: data
    }).then(res => {
      if (res._id) {
        resolve("true");
      } else {
        resolve("flase");
      }
    }).catch(err => {
      resolve(err);
    })
  })
}


module.exports = {
  addOrder
}
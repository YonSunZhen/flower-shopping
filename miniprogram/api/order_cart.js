const db = wx.cloud.database();

//根据user_id查找是否已经存在该用户的购物车数据
const isExist = (user_id) => {
  return new Promise((resolve, reject) => {
    db.collection('order_cart').where({
      user_id: user_id
    }).get().then(res => {
      if (res.data.length > 0) {
        resolve("true");
      } else {
        resolve("false");
      }
    })
  })
}

//增加一条购物车数据
const addCart = (data) => {
  return new Promise((resolve, reject) => {
    db.collection('order_cart').add({
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

//根据user_id查找出该用户的购物车数据
const getCartByUserid = (user_id) => {
  return new Promise((resolve, reject) => {
    db.collection('order_cart').where(
      { user_id: user_id }
    ).get().then(res => {
        resolve(res);
      })
  })
}

//

module.exports = {
  isExist,
  addCart,
  getCartByUserid
}
const db = wx.cloud.database();

//增加商品
const addProduct = (data) => {
  return new Promise((resolve, reject) => {
    db.collection('product_info').add({
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

//根据商品类型id判断是否存在这种类型的商品
const isExist = (categroy_id) => {
  return new Promise((resolve, reject) => {
    db.collection('product_info').where({
      categroy_id: categroy_id
    }).get().then(res => {
      if (res.data.length > 0) {
        resolve("true");
      } else {
        resolve("false");
      }
    })
  })
}


module.exports = {
  addProduct,
  isExist
}
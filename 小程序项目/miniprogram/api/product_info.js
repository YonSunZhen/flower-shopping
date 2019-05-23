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


module.exports = {
  addProduct
}
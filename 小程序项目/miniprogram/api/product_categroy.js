const db = wx.cloud.database();
//增加类型
const addCategroy = (data) => {
  return new Promise((resolve, reject) => {
    db.collection('product_categroy').add({
      data: data
    }).then(res => {
      // console.log('--------');
      // console.log(res._id);
      if (res._id) {
        // console.log('666666666');
        resolve("true");
      } else {
        resolve("flase");
      }
    }).catch(err => {
      // console.log('7777777');
      resolve(err);
    })
  })
}

module.exports = {
  addCategroy
}
const db = wx.cloud.database();

//增加类型
const addCategroy = (data) => {
  return new Promise((resolve, reject) => {
    db.collection('product_categroy').add({
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

//查找所有类型
const getAllCategroy = () => {
  return new Promise((resolve, reject) => {
    db.collection('product_categroy').get().then(res => {
      resolve(res);
    })
  })
}

//根据类型id查找出一条类型
const getOneCategroy = (id) => {
  return new Promise((resolve,reject) => {
    db.collection('product_categroy').doc(id).get().then(res => {
      // res.data 包含该记录的数据
      // console.log(res.data)
      resolve(res.data);
    })
  })
}

module.exports = {
  addCategroy,
  getAllCategroy,
  getOneCategroy
}
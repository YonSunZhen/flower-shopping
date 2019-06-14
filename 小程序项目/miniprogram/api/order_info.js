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

//获取用户进行中的订单
const getOrderByUserId0 = (user_id) => {
  return new Promise((resolve, reject) => {
    db.collection('order_info').where({
      user_id: user_id,
      order_status: 0
    }).orderBy('create_time', 'desc')
      .get().then(res => {
        resolve(res.data);
    })
  })
}

//获取用户已完成的订单
const getOrderByUserId1 = (user_id) => {
  return new Promise((resolve, reject) => {
    db.collection('order_info').where({
      user_id: user_id,
      order_status: 1
    }).orderBy('create_time', 'desc')
      .get().then(res => {
        resolve(res.data);
    })
  })
}

//获取所有进行中的订单
const getAllOrder0 = () => {
  return new Promise((resolve, reject) => {
    db.collection('order_info').where({
      order_status: 0
    }).orderBy('create_time', 'desc')
      .get().then(res => {
        resolve(res.data);
      })
  })
}

//获取所有已完成的订单
const getAllOrder1 = () => {
  return new Promise((resolve, reject) => {
    db.collection('order_info').where({
      order_status: 1
    }).orderBy('create_time', 'desc')
      .get().then(res => {
        resolve(res.data);
    })
  })
}

//根据id获取订单详情
const getOrderDetail = (id) => {
  return new Promise((resolve, reject) => {
    db.collection('order_info').doc(id).get().then(res => {
      resolve(res.data);
    })
  })
}


module.exports = {
  addOrder,
  getOrderByUserId0,
  getOrderByUserId1,
  getAllOrder0,
  getAllOrder1,
  getOrderDetail
}
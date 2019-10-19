const db = wx.cloud.database();
//增加用户
const addUser = (data) => {
  return new Promise((resolve, reject) => {
    db.collection('user_info').add({
      data: data
    }).then(res => {
      if (res._id) {
        resolve("true");
      }else{
        resolve("flase");
      }
    }).catch(err => {
      resolve(err);
    })
  })
}

//根据user_openid查找用户是否已经存在
const isExist = (user_openid) => {
  return new Promise((resolve, reject) => {
    db.collection('user_info').where({
      user_openid: user_openid
    }).get().then(res => {
      // resolve(res.data);
      if (res.data.length > 0) {
        resolve("true");
      } else {
        resolve("false");
      }
    })
  })

}

//根据用户id查找出用户的user_address_id
const getAddressId = (id) => {
  return new Promise((resolve, reject) => {
    db.collection('user_info').where({
      _openid: id
    }).get().then(res => {
      resolve(res.data[0].user_address_id);
    })
  })
}

module.exports = {
  addUser,
  isExist,
  getAddressId
}
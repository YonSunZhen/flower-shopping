const db = wx.cloud.database();

const getManagerId = () => {
  return new Promise((resolve, reject) => {
    db.collection('manager').where(
      { state: "1" }
    ).get().then(res => {
      resolve(res.data);
    })
  })
}

module.exports = {
  getManagerId
}
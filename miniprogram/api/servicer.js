const db = wx.cloud.database();

const getServicerId = () => {
  return new Promise((resolve, reject) => {
    db.collection('servicer').where(
      { state: "1" }
    ).get().then(res => {
      resolve(res.data);
    })
  })
}

module.exports = {
  getServicerId
}
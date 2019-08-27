// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();//这个必须放在db前面
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('order_info').where({
      _id: event.id
    }).remove()
  } catch (e) {
    console.error(e)
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();//这个必须放在db前面
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  return new Promise((resolve, reject) => {
    db.collection('order_info').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: event.data
    }).then((res) => {
      resolve(res);
    })
  })
}
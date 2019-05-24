// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();//这个必须放在db前面
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  return new Promise((resolve, reject) => {
    db.collection('product_categroy').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: event.data
    }).then((res) => {
      resolve(res);
    })
  })

}
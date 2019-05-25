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

//根据商品类型id判断是否存在这种类型的商品
const isExist = (categroy_id) => {
  return new Promise((resolve, reject) => {
    db.collection('product_info').where({
      categroy_id: categroy_id
    }).get().then(res => {
      if (res.data.length > 0) {
        resolve("true");
      } else {
        resolve("false");
      }
    })
  })
}

//查找所有商品(分页)
const getAllProduct = (pageIndex, pageSize) => {
  // const filter = filterParam !== '' ? filterParam : null;
  // const pageIndex = pageIndexParam !== '' ? pageIndexParam : 1;
  // const pageSize = pageSizeParam !== '' ? pageSizeParam : 10;
  // const countResult = db.collection('product_info').where(filter).count().then( (res) => {
  //   const total = countResult.total;
  //   const totalPage = Math.ceil(total / pageSize);
  //   let hasMore;
  //   if (pageIndex > totalPage || pageIndex == totalPage) {
  //     hasMore = false;
  //   } else {
  //     hasMore = true;
  //   }
    
  // });
  return new Promise((resolve, reject) => {
    db.collection('product_info').skip( (pageIndex - 1) * pageSize).limit(pageSize).get().then(res => {
      resolve(res);
    })
  })
}

//根据商品状态查找商品
const getProductsByState = (product_state) => {
  return new Promise((resolve, reject) => {
    db.collection('product_info').where({
      product_state: product_state
    }).get().then(res => {
      resolve(res);
    })
  })
}

//根据商品id查找出商品详情
const getOneProduct = (id) => {
  return new Promise((resolve, reject) => {
    db.collection('product_info').doc(id).get().then(res => {
      resolve(res.data);
    })
  })
}


module.exports = {
  addProduct,
  isExist,
  getProductsByState,
  getAllProduct,
  getOneProduct
}
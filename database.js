//用户信息表表(user_info)
user_info: [
  {
    user_id: string, //用户id oTy3U5B5uMil2A8ltOIijqEbXoo8
    user_address_id: ["地址id1","地址id2"] //用户收货地址
  }
]

//用户地址表(user_addr)
user_addr: [
  {
    address_id: string, //地址id
    user_id: string, //用户id(外键)
    consignee_name: string, //收货人姓名
    consignee_phone: number, //收货人联系方式
    address_detail: string, //地址详情
    is_default: number //是否默认(0:不默认,1:默认)
  }
]

//商品类型表(product_categroy)
product_categroy: [
  {
    categroy_id: string, //类型id
    categroy_name: string, //类型名
    create_time: date //创建时间
  }
]

//库存商品信息表(product_info)
product_info: [
  {
    product_id: string, //商品id
    categroy_id: string, //类型id(外键)
    product_name: string, //商品名称
    price: number, //商品销售价格
    //old_price: number, //商品进货价格
    product_img: string, //商品图片
    product_count: number, //商品总数量
    product_surplus: number, //商品剩余数量
    product_descript: string, //商品描述
    publish_status: number, //商品上下架状态(0:下架,1:上架)
    publish_time: date, //商品上架时间
    product_remark: string //商品备注
  }
]

//购物车表(order_cart)
order_cart: [
  {
    card_id: string, //购物车id
    user_id: string, //用户id(外键)
    cart_products: [ //购物车的商品
      {
        product_id: string, //商品id(相当于外键)
        order_quantity: number, //订购量
        add_time: date, //商品加入购物车加入时间
      }
    ],
    create_time: date //创建购物车时间
  }
]

//订单表(order)
order: [
  {
    order_id: string, //订单id
    user_id: string, //用户id(相当于外键)
    address_id: string, //收货地址id(相当于外键)
    order_products: [ //订单商品
      {
        product_id: string, //商品id(相当于外键)
        order_quantity: number //订购量
      }
    ],
    create_time: date, //创建订单时间
    order_money: number, //订单总金额
    order_status: number, //订单状态(0:正在进行中, 1:已经完成)
    deliver_time: date, //派送时间
    deliver_remark: string //派送备注信息
  }
]
  



export const roleApi = {
  getRoleTypeName(type) {
    type = type.toLowerCase()

    if (type === 'admin') {
      return '店长'
    } else if (type === 'waiter') {
      return '服务员'
    } else if (type === 'cooker') {
      return '厨师'
    } else if (type === 'waiter') {
      return '服务员'
    } else if (type === 'cashier') {
      return '收银'
    } else if (type === 'takeOut') {
      return '外卖'
    } else if (type === 'owner') {
      return '管理员'
    } else {
      return type
    }
  }
}

import { storeApi } from './storeApi'

export const stateApi = {
  clearAll() {
    storeApi.object.set(this.user._key, {})
  },
  user: {
    _key: 'user',
    setId(id) {
      return storeApi.pair.set(this._key, 'id', id)
    },
    getId() {
      return storeApi.pair.get(this._key, 'id')
    },
    setPhone(phone) {
      return storeApi.pair.set(this._key, 'phone', phone)
    },
    getPhone() {
      return storeApi.pair.get(this._key, 'phone')
    },
    setWechatOpenId(wechatOpenId) {
      return storeApi.pair.set(this._key, 'wechatOpenId', wechatOpenId)
    },
    getWechatOpenId() {
      return storeApi.pair.get(this._key, 'wechatOpenId')
    },
    setAlipayOpenId(alipayOpenId) {
      return storeApi.pair.set(this._key, 'alipayOpenId', alipayOpenId)
    },
    getAlipayOpenId() {
      return storeApi.pair.get(this._key, 'alipayOpenId')
    },
    setAvatar(avatar) {
      return storeApi.pair.set(this._key, 'avatar', avatar)
    },
    getAvatar() {
      return storeApi.pair.get(this._key, 'avatar')
    }
  },
  table: {
    _key: 'table',
    setCaptchaTableId(id) {
      return storeApi.pair.set(this._key, 'captchaTableId', id)
    },
    getCaptchaTableId() {
      return storeApi.pair.get(this._key, 'captchaTableId')
    },
    setTableNumber(id) {
      return storeApi.pair.set(this._key, 'tableNumber', id)
    },
    getTableNumber() {
      return storeApi.pair.get(this._key, 'tableNumber')
    },
    setTableName(id) {
      return storeApi.pair.set(this._key, 'tableName', id)
    },
    getTableName() {
      return storeApi.pair.get(this._key, 'tableName')
    }

  }
}

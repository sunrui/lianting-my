export const validatorApi = {
  phone(phone) {
    return /^[1][34578][0-9]{9}$/.test(phone)
  },
  code(code) {
    return code && code.length === 6
  },
  password(password) {
    return /[a-zA-Z0-9_]{5,19}$/.test(password)
  },
  userName(userName) {
    return /[a-zA-Z0-9_]{3,15}$/.test(userName)
  }
}

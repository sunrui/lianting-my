import axios from 'axios'

let base = '/api/c'

export const httpFoodApi = {
  getGroup(shortId, foodGroupId) {
    return axios.get(`${base}/${shortId}/food/group/${foodGroupId}`).then(res => res.data)
  },
  getGroupAll(shortId, page, size) {
    return axios.get(`${base}/${shortId}/food/group`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getCategory(shortId, foodCategoryId) {
    return axios.get(`${base}/${shortId}/food/category/${foodCategoryId}`).then(res => res.data)
  },
  getCategoryAll(shortId, foodGroupId) {
    return axios.get(`${base}/${shortId}/food/category`, {
      params: {
        foodGroupId: foodGroupId
      }
    }).then(res => res.data)
  },
  getCategoryByNameLike(shortId, nameLike, page, size) {
    return axios.get(`${base}/${shortId}/food/category`, {
      params: {
        nameLike: nameLike,
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getGarnish(shortId, foodCategoryId, page, size) {
    return axios.get(`${base}/${shortId}/food/garnish`, {
      params: {
        foodCategoryId: foodCategoryId,
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getFoodAll(shortId, foodCategoryId, page, size) {
    return axios.get(`${base}/${shortId}/food/food`, {
      params: {
        foodCategoryId: foodCategoryId,
        page: page,
        size: size
      }
    }).then(res => res.data)
  }
}

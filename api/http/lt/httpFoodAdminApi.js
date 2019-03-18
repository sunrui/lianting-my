import axios from 'axios'
import Food from '../../../components/food/Food'

let base = '/api/b'

export const httpFoodAdminApi = {
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
  postGroup(shortId, foodGroup) {
    return axios.post(`${base}/${shortId}/food/group`, foodGroup).then(res => res.data)
  },
  putGroup(shortId, foodGroupId, model) {
    return axios.put(`${base}/${shortId}/food/group/${foodGroupId}`, model).then(res => res.data)
  },
  deleteGroup(shortId, foodGroupId) {
    return axios.delete(`${base}/${shortId}/food/group/${foodGroupId}`).then(res => res.data)
  },
  postCategory(shortId, foodCategory) {
    return axios.post(`${base}/${shortId}/food/category`, foodCategory).then(res => res.data)
  },
  putCategory(shortId, foodCategory) {
    return axios.put(`${base}/${shortId}/food/category/${foodCategory.id}`, foodCategory).then(res => res.data)
  },
  deleteCategory(shortId, foodCategoryId) {
    return axios.delete(`${base}/${shortId}/food/category/${foodCategoryId}`).then(res => res.data)
  },
  postFood(shortId, food) {
    return axios.post(`${base}/${shortId}/food/food`, food).then(res => res.data)
  },
  putFood(shortId, food) {
    return axios.put(`${base}/${shortId}/food/food/${food.id}`, Food).then(res => res.data)
  },
  deleteFood(shortId, foodId) {
    return axios.delete(`${base}/${shortId}/food/food/${foodId}`).then(res => res.data)
  }
}

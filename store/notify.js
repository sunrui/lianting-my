// this.$store.commit('cart/update', cart);
// let cart = store.state.cart;

export const state = () => ({
  role: null
})

export const mutations = {
  update(state, role) {
    state.role = role
  }
}

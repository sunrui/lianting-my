// this.$store.commit('cart/update', cart)
// let cart = this.store.state.cart

export const state = () => ({
  cart: null
})

export const mutations = {
  update(state, cart) {
    state.cart = cart
  }
}

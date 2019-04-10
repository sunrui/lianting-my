// this.$store.commit('user/update', user)
// let user = this.$store.state.user

export const state = () => ({
  user: null
})

export const mutations = {
  update(state, user) {
    state.user = user
  }
}

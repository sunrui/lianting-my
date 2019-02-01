// this.$store.commit('navbar/update', navbar);
// let home = Boolean(store.state.navbar.home);

export const state = () => ({
  canBack: true,
  title: '',
  home: '/'
})

export const mutations = {
  update(state, navbar) {
    state.canBack = navbar.canBack
    state.title = navbar.title
    state.home = navbar.home
  }
}

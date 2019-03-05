export default ({ app }) => {
  app.router.afterEach((to, from) => {
    if (to.meta.title) {
      document.title = to.meta.title;
    }else{
      document.title = '恋厅';
    }
  })
}

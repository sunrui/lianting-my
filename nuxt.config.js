const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: pkg.viewport },
      { hid: 'keywords', name: 'description', content: pkg.keywords.toString() },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://cdn.bootcss.com/plupload/3.1.2/plupload.full.min.js' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    { src: '~static/css/fade.css', lang: 'css' }
  ],


  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/message_box.js', ssr: false },
    { src: '~plugins/rem.js', ssr: false },
    { src: '~plugins/axios.js', ssr: false },
    { src: '~plugins/meta.js', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    ['nuxt-sass-resources-loader', [
      '@/assets/scss/px2rem.scss'
    ]]
  ],
  proxy: [
    [
      '/api',
      {
        target: 'http://localhost:8080',
        // target: 'http://honeysense.com/api',
        pathRewrite: { '^/api': '/' }
      }
    ]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  }
}

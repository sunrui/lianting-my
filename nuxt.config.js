const pkg = require('./package')

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.title,
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: pkg.viewport},
      {name: 'theme-color', content: '#FF6958'},
      {hid: 'keywords', name: 'keywords', content: pkg.keywords.toString()},
      {hid: 'description', name: 'description', content: pkg.description},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ],
    script: []
  },

  resourceHints: false,

  /*
  ** Customize the progress-bar color
  */
  loading: '~/components/common/GlobalLoading.vue',

  /*
  ** Global CSS
  */
  css: [
    '~static/css/common.css',
    '~static/css/normalize.css'
  ],

  env: {
    NODE_ENV: process.env.NODE_ENV
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~plugins/axios', ssr: false},
    {src: '~plugins/stat', ssr: false},
    {src: '~plugins/console', ssr: false},
    {src: '~plugins/https', ssr: false},
    {src: '~plugins/message_box', ssr: false},
    {src: '~plugins/rem', ssr: false},
    {src: '~plugins/meta', ssr: false},
    {src: '~plugins/scroller', ssr: false},
    {src: '~plugins/route', ssr: false}
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    sass: ['@/assets/px2rem.scss'],
    less: [],
    stylus: []
  },
  proxy: [
    [
      '/api',
      {
        target: 'http://localhost:8080',
        // target: 'http://shop.lt.city/api',
        pathRewrite: {'^/api': '/'}
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

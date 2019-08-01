const pkg = require('./package')

const modifyHtml = (html) => {
  html = html.replace(/ data-n-head-ssr/g, '')
  html = html.replace(/ data-server-rendered="true"/g, '')
  html = html.replace(/ data-n-head=""/g, '')
  return html.replace(/ data-n-head="true"/g, '')
}

module.exports = {
  mode: 'universal',
  htmlAttrs: {
    lang: 'zh-cmn-Hans',
  },

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
    // {src: '~plugins/down', ssr: false},
    {src: '~plugins/axios', ssr: false},
    {src: '~plugins/console', ssr: false},
    // {src: '~plugins/https', ssr: false},
    {src: '~plugins/message_box', ssr: false},
    {src: '~plugins/meta', ssr: false},
    {src: '~plugins/route', ssr: false},
    {src: '~plugins/scroller', ssr: false},
    {src: '~plugins/stat', ssr: false},
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
        pathRewrite: {
          '^/api': '/',
          changeOrigin: true
        }
      }
    ]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true,
    debug: false,
    prefix: '/api',
    credentials: true
  },

  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    postcss: {
      plugins: {
        'postcss-px2rem': {
          remUnit: 100
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  },
  render: {
    static: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
    resourceHints: false,
  },
  generate: {
    subFolders: false
  },
  hooks: {
    'generate:page': (page) => {
      page.html = modifyHtml(page.html)
    },
    'render:route': (url, page, {req, res}) => {
      page.html = modifyHtml(page.html)
    }
  }
}

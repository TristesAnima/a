import routes from './routes';

export default {
  define: {
    'process.env.PROJECT_CODE': 'CTMS',
    'process.env.PROJECT_VERSION': '0.1.0',

    'process.env.CLOUD_CODE': 'ctms',

    'process.env.ICON_FONT': {
      scriptUrl: '//at.alicdn.com/t/font_694023_nt67kopbb9s.js',
    },

    'process.env.DEFAULT_MAIN_PAGE': '/404',
    'process.env.DEFAULT_LAYOUT_TYPE': 'mix',

    'process.env.DEBUG_MODE': true,
  },

  chainWebpack: (config) => {
    config.module.rule('mjs-rule').test(/.m?js/).resolve.set('fullySpecified', false);
  },
  model: {},
  initialState: {},
  access: {},
  mock: {
    include: ['src/pages/**/_mock.js'],
  },
  favicons: ['/images/logo.png'],
  title: 'Deep Intelligent Pharma',

  history: {
    type: 'browser',
  },
  publicPath: process.env.ENV_PUBLIC_PATH || '/',
  hash: true,
  antd: {},
  dva: {},
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  ignoreMomentLocale: true,

  theme: {
    /**
     * 定制主题
     * ~antd/lib/style/themes/default.less
     */
    'primary-color': '#08979C',

    // dark theme
    'menu-dark-color': '#ffffff59',
    'disabled-color': 'rgba(0, 0, 0, .45)', // 失效色
    'select-multiple-item-disabled-color': 'rgba(0, 0, 0, 0.45)',
    'disabled-bg': '#f5f5f5b3',
  },
  routes,
  proxy: {
    '/ctms/api/': {
      target: 'https://ssu-jp-dev.dip-aitech.com',
      // target: 'https://ctms-dev.dip-aitech.com',
      // target: 'http://192.168.1.22:8602',
      changeOrigin: true,
      pathRewrite: { '^/ctms/api/': '/ssu/api/' },
      // pathRewrite: { '^/ctms/api/': '/ctms/' },
    },
    '/sso/api/': {
      target: 'https://cloud-dev.dip-aitech.com',
      changeOrigin: true,
      // pathRewrite: { '^/sso/api/': '/sso/api/' },
    },
  },
};

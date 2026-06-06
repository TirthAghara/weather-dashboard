
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1986, hash: '5019ff245cfa8e2f3d73d5367dbd4cd0603260776f3b66f32ea4a2a9922d064b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 954, hash: 'ef73d8e853247524988f8c7523a964c7f230736fbd3d7927c180d9ee4d3ec70b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 7232, hash: '4e322e41aa0560df8199680035d8ae69b6c53cb64645bdd3de20253537f89846', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5GE6NQ36.css': {size: 4292, hash: '/gokc37hG0g', text: () => import('./assets-chunks/styles-5GE6NQ36_css.mjs').then(m => m.default)}
  },
};

const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SRC_DIR = path.join(ROOT, 'src');
const JS_SRC_DIR = path.join(SRC_DIR, 'js');
const JS_PUBLIC_DIR = path.join(PUBLIC_DIR, 'assets', 'js');

module.exports = {
  root: ROOT,
  publicDir: PUBLIC_DIR,
  srcDir: SRC_DIR,
  js: {
    src: JS_SRC_DIR,
    public: JS_PUBLIC_DIR,
    main: path.join(JS_SRC_DIR, 'script.js'),
    data: path.join(JS_SRC_DIR, 'data.js'),
    modules: path.join(JS_SRC_DIR, 'modules')
  },
  styles: {
    main: path.join(PUBLIC_DIR, 'styles', 'styles.css')
  },
  pages: {
    index: path.join(PUBLIC_DIR, 'index.html'),
    consulta: path.join(PUBLIC_DIR, 'consulta.html'),
    landing: path.join(PUBLIC_DIR, 'landing.html'),
    sobre: path.join(PUBLIC_DIR, 'sobre.html'),
    faq: path.join(PUBLIC_DIR, 'faq.html'),
    testTheme: path.join(PUBLIC_DIR, 'test-theme.html')
  }
};

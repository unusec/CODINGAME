const path = require('path')
export default {
  resolve:{
    alias:{
      '@' : path.resolve(__dirname, './src')
    },
  },
  build: {
    minify: false,
    assetsDir:"./",
    emptyOutDir: false,
    polyfillModulePreload: false,
    rollupOptions: {
      input: "./src/main.js",
    },
  },
};

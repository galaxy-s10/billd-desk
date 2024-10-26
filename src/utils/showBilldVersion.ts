import BilldHtmlWebpackPlugin from 'billd-html-webpack-plugin/package.json';
import BilldScss from 'billd-scss/package.json';
import BilldUtils from 'billd-utils/package.json';

console.table({
  'billd-utils': BilldUtils.version,
  'billd-scss': BilldScss.version,
  'billd-html-webpack-plugin': BilldHtmlWebpackPlugin.version,
});

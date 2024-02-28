import BilldDeploy from 'billd-deploy/package.json';
import BilldHtmlWebpackPlugin from 'billd-html-webpack-plugin/package.json';
import BilldScss from 'billd-scss/package.json';
import BilldUtils from 'billd-utils/package.json';

console.table({
  'billd-utils': BilldUtils.version,
  'billd-scss': BilldScss.version,
  'billd-deploy': BilldDeploy.version,
  'billd-html-webpack-plugin': BilldHtmlWebpackPlugin.version,
});

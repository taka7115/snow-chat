const path = require('path');
const {
  VueLoaderPlugin
} = require('vue-loader')
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  /**
   * while development：development
   * just before submission to client：production
   */
  mode: "production",
  /**
   * choose several different js files
   */
  entry: {
    'bundle': './src/assets/js/main.ts',
  },

  /**
   * path where bundle file is output
   */
  output: {
    path: __dirname,
    filename: "[name].js"
  },

  /**
   * loader
   */
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true,
        },
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          //vueをtypescriptとして監視する
          appendTsSuffixTo: [/\.vue$/]
        },
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            // use scss file
            options: {
              implementation: require('sass'),
              resources: [
                path.resolve(__dirname, 'src/assets/scss/foundation/base/_mixin.scss'),
                path.resolve(__dirname, 'src/assets/scss/foundation/base/_function.scss'),
                path.resolve(__dirname, 'src/assets/scss/foundation/base/_properties.scss')
              ]
            }
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        use: 'file-loader?name=assets/[name]-[hash].[ext]'
      }
    ]
  },
  resolve: {
    //import文で、.tsを省略できるようにする
    extensions: ['.js', '.ts'],
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  watchOptions: {
    ignored: /node_modules/ //正規表現で指定
  },
  /**
   * bundle.js.LICENSE.txtを出力しない
   */
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
};
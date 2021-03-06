var HtmlWebpackPlugin = require('html-webpack-plugin');
var poststylus = require('poststylus');
const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  // メインとなるJavaScriptファイル（エントリーポイント）
  // watch: true,
  entry: './src/ts/main.ts',
  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/docs`,
    // 出力ファイル名
    filename: 'js/bundle.js'
  },
  plugins: [
      new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/pug/index.pug',  // この行を変更
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'sp.html',
      template: 'src/pug/sp.pug',  // この行を変更
      inject: true
    }),
    new ExtractTextPlugin("./css/main.css"),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      options: {
        stylus: {
          use: [poststylus([ 'autoprefixer', 'rucksack-css' ])]
        }
      }
    })
  ],

  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'awesome-typescript-loader'
      },
      // ソースマップファイルの処理
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.pug$/,
        loader: ['raw-loader', 'pug-html-loader']
      },
      {
        // Stylusファイル用の処理
        test: /\.(css|sass|styl)/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "stylus-loader"]
        })
      },
      {
        test: /\.(jpg|png|gif|svg|)$/,
        loader: ['url-loader']
      },
      {
        test: /\.(glsl|vs|fs|frag|vert)$/,
        loader: 'shader-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.mp3$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    extensions: [
      '.ts', '.js', '.json', '.pug', '.styl',
      path.join(__dirname, "js/helpers"),
      "node_modules"
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'docs'),
    port: 3000,
    host: "0.0.0.0"
  },
  // ソースマップを有効に
  devtool: 'source-map'
};

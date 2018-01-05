// ------------------------------------------------------------------
// Default Dependencies
// ------------------------------------------------------------------

const webpack = require('webpack');
const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let { pluginsProd, webpackInstances } = require(resolve(
  __dirname,
  './webpack.func.js'
));

const {
  entries,
  styleLoaderDev,
  styleLoaderProd,
  pluginsDev,
  generateHtmls,
  foo
} = require(resolve(__dirname, './webpack.func.js'));

// ------------------------------------------------------------------
// Plugins & Other configs
// ------------------------------------------------------------------

const plugins = () => {
  let arr = [];
  process.env.NODE_ENV == 'development'
    ? arr.push(...pluginsDev())
    : arr.push(...pluginsProd());

  return arr;
};

// ------------------------------------------------------------------

const sassLoader = () => {
  return process.env.NODE_ENV == 'production'
    ? styleLoaderProd()
    : styleLoaderDev();
};

// ------------------------------------------------------------------
// Webpack config
// ------------------------------------------------------------------

let config = {
  entry: entries(),
  output: {
    filename: 'bundle_[name]_[hash].js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  context: resolve(__dirname, 'source'),
  devtool:
    process.env.NODE_ENV == 'production' ? 'source-map' : 'cheap-module-map',
  stats: 'errors-only',
  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
    publicPath: '/',
    disableHostCheck: true,
    stats: 'verbose'
  },
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules|\.tmp|vendor/
      },
      {
        test: /\.css.scss$/,
        use: sassLoader()
      },
      {
        test: /\.(png|jpe?g|gif|ico)$/,
        use: 'file-loader?name=[path][name].[ext]'
      },
      {
        test: /\.(svg)$/i,
        use: 'svg-inline-loader'
      },
      {
        test: /\.(mp4|mov|webm|pdf|zip)$/,
        use: 'file-loader?name=[path][name].[ext]'
      },
      {
        test: /\.(ttf|eot|otf|woff(2)?)(\w+)?$/,
        use: 'file-loader?name=[path][name].[ext]'
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.scss', '.css', '.svg'],
    alias: {
      stylesheets: resolve(__dirname, 'source/stylesheets'),
      javascripts: resolve(__dirname, 'source/javascripts'),
      assets: resolve(__dirname, 'assets')
    }
  }
};

module.exports = config;

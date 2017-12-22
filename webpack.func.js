const webpack = require('webpack');
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var webpackInstances;

// ------------------------------------------------------------------

exports = webpackInstances;

exports = appEntries = 
  [
    {
      pagename: 'index',
      pathJS: ['source/javascripts/index.js'],
      pathHtml: './build/index.html'
    },
    { pagename: 'foo',
      pathJS: ['source/javascripts/foo/foo.js'],
      pathHtml: './build/pages/foo.html'
    }
  ]

// ------------------------------------------------------------------

exports = entries = () => {
  let common = ['babel-polyfill', 'whatwg-fetch'];
  let entriesArr = {};
  webpackInstances = [];

  let mergedArr = Object.assign([], appEntries);
  mergedArr.forEach((index, value) => {
    let arrPaths = [];
    arrPaths.push(...common, resolve(__dirname, index.pathJS[0]));

    webpackInstances.push(new HtmlWebpackPlugin({  
      filename: `${index.pagename}.html`,
      template: resolve(__dirname, index.pathHtml),
      chunks: ['common', index.pagename]
    }))

    entriesArr[index.pagename] = arrPaths;
    
  });
  
  return entriesArr;
}

// ------------------------------------------------------------------

exports = styleLoaderDev = () => {
  let styleLoaderDev = [
    'style-loader',
    {
      loader: 'css-loader?sourceMap'
    },
    {
      loader: 'sass-loader?sourceMap',
      options: {
        includePaths: [
          resolve(__dirname, 'source/stylesheets'),
          resolve(__dirname, 'node_modules')
        ]
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        config: {
          path: resolve(__dirname, './postcss.config.js')
        }
      }
    }
  ];

  return styleLoaderDev;
}

// ------------------------------------------------------------------

exports = styleLoaderProd = () => {
  let styleLoaderProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      { loader: 'css-loader', options: { minimize: true } },
      {
        loader: 'sass-loader',
        options: {
          includePaths: [
            resolve(__dirname, 'source/stylesheets'),
            resolve(__dirname, 'node_modules')
          ]
        }
      },
      { loader: 'postcss-loader' }
    ]})
  return styleLoaderProd;
}

// ------------------------------------------------------------------


exports = pluginsDev = () => {
  return [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }) 
  ]
}

// ------------------------------------------------------------------

exports = pluginsProd = () => {
  return [
    new UglifyJsPlugin({
      test: /\.js($|\?)/i
    }),
    new ExtractTextPlugin({
      disable: false,
      filename: 'bundle_[name]_[hash].css'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    }), 
    ...webpackInstances
  ];
};

// ------------------------------------------------------------------


exports = generateHtmls = (htmlName, htmlPath) => {
  let generateInstances = [];

  generateInstances.push(new HtmlWebpackPlugin({  
    filename: `${htmlName}.html`,
    template: htmlPath,
    chunks: [htmlName]
  }))
  webpackInstances = generateInstances
}

return (module.exports = {webpackInstances, entries, styleLoaderDev, styleLoaderProd, pluginsDev, pluginsProd, generateHtmls, appEntries});
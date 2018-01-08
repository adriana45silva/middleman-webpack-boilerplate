const webpack = require('webpack');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const dirTree = require('directory-tree');
const dirTreeJson = dirTree(resolve(__dirname), {
  exclude: /node_modules/,
  extensions: /\.html|js/
});

// ------------------------------------------------------------------

function traverseDirTree(json) {
  var jsArr = [];
  var htmlArr = [];

  function traverseSubDirTree(arr) {
    for (let i in arr) {
      let currentEl = arr[i];
      if (currentEl.type === 'file') {
        if (currentEl.extension == '.js' && currentEl.path.includes('source')) {
          jsArr.push(currentEl);
        } else if (
          currentEl.extension == '.html' &&
          currentEl.path.includes('build')
        ) {
          htmlArr.push(currentEl);
        }
      } else if (currentEl.type == 'directory') {
        traverseSubDirTree(currentEl.children);
      }
    }
    return { jsArr, htmlArr };
  }

  return traverseSubDirTree(json.children);
}

// ------------------------------------------------------------------

exports = entries = () => {
  let common = ['babel-polyfill', 'whatwg-fetch'];
  var newArr = [];
  var obj = {};

  let jsArr = traverseDirTree(dirTreeJson).jsArr;

  jsArr.forEach(el => {
    obj[el.name.substr(0, el.name.length - 3)] = [...common, el.path];
  });

  return obj;
};

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
};

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
    ]
  });
  return styleLoaderProd;
};

// ------------------------------------------------------------------

exports = pluginsDev = () => {
  return [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ];
};

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
    ...generateHtmls()
  ];
};

// ------------------------------------------------------------------

exports = generateHtmls = (htmlName, htmlPath) => {
  let generateInstances = [];
  let htmlArr = traverseDirTree(dirTreeJson).htmlArr;

  htmlArr.forEach(el => {
    let name = el.name.substr(0, el.name.length - 5);
    generateInstances.push(
      new HtmlWebpackPlugin({
        filename: `${el.name}.html`,
        template: el.path,
        chunks: [name]
      })
    );
  });

  return generateInstances;
};

return (module.exports = {
  entries,
  styleLoaderDev,
  styleLoaderProd,
  pluginsDev,
  pluginsProd,
  generateHtmls
});

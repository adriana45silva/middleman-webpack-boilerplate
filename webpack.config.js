// ------------------------------------------------------------------
// Default Dependencies
// ------------------------------------------------------------------

const webpack = require('webpack');
const {resolve} = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let bar;
const appEntries = 
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
// Plugins & Other configs
// ------------------------------------------------------------------


const generateHtmls = (htmlName, htmlPath) => {
  console.log('aaaaaa')
  return new HtmlWebpackPlugin({  
    filename: `${htmlName}.html`,
    template: htmlPath
  })
}

const pluginsDev = () => {
  return [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }) 
  ]
}

let pluginsProd = () => {
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
    }), bar
  ];
};


// ------------------------------------------------------------------

const styleLoaderDev = () => {
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

const styleLoaderProd = () => {
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

const plugins = () => {
  let arr = [];
  process.env.NODE_ENV == 'development' ? arr.push(...pluginsDev()) : arr.push(...pluginsProd());

  return arr;
}

// ------------------------------------------------------------------

const entries = () => {
  let common = ['babel-polyfill', 'whatwg-fetch'];
  var b = {};
  let entries = [];
  let foo = [];

  entries.push(...common, resolve(__dirname, 'source/javascripts/index.js'));
  foo.push(...common, resolve(__dirname, 'source/javascripts/foo/foo.js'));

  // console.log(foo)
  // console.log(entries)


  var a = Object.assign([], appEntries);
  a.forEach((index, value) => {
    // index.pathJs.unshift(...common);
    // let resolvePaths = ;
    let arrPaths = [];
    arrPaths.push(...common, resolve(__dirname, index.pathJS[0]));
    bar = generateHtmls(index.pagename,  resolve(__dirname, index.pathHtml) );


    // console.log(b[index.pagename] = index.pathJs)

    console.log(resolve(__dirname, index.pathHtml))

    b[index.pagename] = arrPaths;
    
  });

  
  
  
//  return {
//     boo: entries,
//     foo: foo
//  }
  
  return b;
}

// ------------------------------------------------------------------

const sassLoader = () => {
  return process.env.NODE_ENV == 'production' ? styleLoaderProd() : styleLoaderDev();
};

// ------------------------------------------------------------------
// Webpack config
// ------------------------------------------------------------------


let config = {
  entry: entries(),
  output: {
    filename: 'bundle_[name]_[hash].js',
    path: resolve(__dirname, 'webpack-dist'),
    publicPath: '/'
  },
  context: resolve(__dirname, 'source'),
  devtool:
    process.env.NODE_ENV == 'production'
      ? 'source-map'
      : 'cheap-module-map',
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
        use: [ 'babel-loader' ],
        exclude: /node_modules|\.tmp|vendor/
      },
      {
        test: /\.scss$/,
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
    extensions: [
      '.js',
      '.json',
      '.scss',
      '.css',
      '.svg',
    ],
    alias: {
      stylesheets: resolve(__dirname, 'source/stylesheets'),
      javascripts: resolve(__dirname, 'source/javascripts'),
      assets: resolve(__dirname, 'assets')
    }
  }
};

console.log(pluginsProd())

module.exports = config;

// ------------------------------------------------------------------
// Style Dependencies
// ------------------------------------------------------------------

const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

const postCSSPlugins = [ autoprefixer, pxtorem() ];

module.exports = postCSSPlugins;
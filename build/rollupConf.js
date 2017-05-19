const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  format: 'cjs',
  moduleName: 'jsonp',
  dest: path.resolve(__dirname, '../dist/index.js'),
  sourceMap: false,
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    commonjs()
  ]
}
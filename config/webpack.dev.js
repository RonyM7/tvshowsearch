//https://stackoverflow.com/questions/31718908/webpack-output-files-to-different-directories

var webpack = require("webpack"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    path = require('path');

module.exports = {
  context: path.join(__dirname, "../src"),
  entry: "./js/index.js",
  output: {
    path: path.resolve(__dirname, 'src/'),
    filename: './index.min.js'
  },
  devServer: {
    
    port: 4000
  },
  devtool: 'source-map',
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'url-loader?limit=20000&name=assets/images/[name].[ext]'
      },
       {
         test: /\.html$/,
         loader: "raw-loader"
      },
      {
        test: /\.php$/,
        loaders: [
          'html-minify',
          'php-loader'
        ]
      },
         {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
   ]
 },
 plugins: [
   new CopyWebpackPlugin([
     { from: './assets/images', to: './assets/images'}
   ]),
   //Pages
   new HtmlWebpackPlugin({
     filename: 'index.html',
     template: './index.html'
   }),
   
   new ExtractTextPlugin('./styles/bundle.css')
 ]
};

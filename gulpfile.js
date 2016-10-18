/**
 * Created by katsura on 16-10-5.
 */
var gulp = require('gulp')
var pluginLoader = require('gulp-load-plugins')
var gutil = pluginLoader.util
var rimraf = require('rimraf')
var webpack = require('webpack')
var webpackDevConfig = require('./build/webpack.dev.conf')
var webpackPrdConfig = require('./build/webpack.prod.conf')

// The development server (the recommended option for development)
gulp.task('default', ['dev-server'])

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task('build-dev', ['webpack:build-dev'], function() {
  gulp.watch(['src/**/*'], ['webpack:build-dev'])
})

// Production build
gulp.task('build', ['webpack:build'])

gulp.task('webpack:build', function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackPrdConfig)
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  )

  // run webpack

  require('./task/build')(myConfig)
})

// modify some webpack config options
var myDevConfig = Object.create(webpackDevConfig)
myDevConfig.devtool = 'sourcemap'
myDevConfig.debug = true

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig)

gulp.task('webpack:build-dev', function(callback) {
  // run webpack
  devCompiler.run(function(err, stats) {
    if(err) throw new gutil.PluginError('webpack:build-dev', err)
    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }))
    callback()
  })
})

gulp.task('dev-server', function(callback) {
  // Start a dev-server
  require('./task/dev-server')

})

gulp.task('clean', function (cb) {
  rimraf('./dist', cb)
})

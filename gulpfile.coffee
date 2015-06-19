gulp = require 'gulp'
hint = require 'gulp-jshint'
mocha = require 'gulp-mocha'

glob = (dir, ext = 'js') -> "#{dir}/**/*.#{ext}"

gulp.task 'lint', ->
  gulp.src glob('lib')
  .pipe hint()
  .pipe hint.reporter('default')

gulp.task 'test', ->
  gulp.src(glob('test'), { read: false })
  .pipe(mocha { reporter: 'tap' })

gulp.task 'default', ['lint', 'test']
gulp.task 'watch', -> gulp.watch(lib, 'default')
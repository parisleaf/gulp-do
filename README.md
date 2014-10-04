# gulp-do

Directory-based, promisified task management for Gulp

## Installation

```
npm install --save-dev gulp-do
```


## Usage

gulp-do does two things:

1. Loads and registers tasks automatically from a directory of files.
2. Enables promise-based task dependency management.

By default, gulp-do loads tasks from the `/gulp` directory. Each file in the directory should export a function that will be passed to `gulp.task`. The name of the task will be taken from the name of the file If the task is asynchronous, the function should return a promise.

```js
// gulpfile.js
var gulp = require('gulp');
var task = require('gulp-do');

task.configure(gulp);
```

```js
// gulp/foo.js
module.exports = function() {
  return new Promise(function(resolve, reject) {
    console.log('foo');
    setTimeout(resolve, 0);
  });
};
```

```js
// gulp/bar.js
var gulp = require('gulp');
var task = require('gulp-do');

module.exports = function() {
  task.do('foo').then(function() {
    console.log('bar');
  });
};
```

Then from the command line:
```
$ gulp bar
[18:38:20] Using gulpfile ~/Projects/foodie/gulpfile.js
[18:38:20] Starting 'bar'...
foo
[18:38:20] Finished 'bar' after 706 μs
bar
```

## API

```js
var task = require('gulp-do');
```

### `task.configure(gulp, options)`

Call this once in your gulpfile, passing an instance of gulp. The only valid option right now is `taskDir`, which defaults to `./gulp`. If `options` is a string instead of an object, it overrides `taskDir`.

## License

MIT

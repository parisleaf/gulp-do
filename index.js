'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var Promise = global.Promise || require('es6-promise');

function scriptFilter(filename) {
  return /(\.js$)/i.test(path.extname(filename));
}

var defaults = {
  taskDir: './gulp',
};

function GulpDo() {
  var self = this;

  this.tasks = {};

  this.do = function() {
    var name = arguments[0];
    var args = arguments.length ? [].slice.call(arguments, 1) : [];
    return Promise.resolve(this.tasks[name].apply(this.tasks, args));
  };

  this.get = function(name) {
    return this.tasks[name];
  };

  this.configure = function(gulp, options) {
    if (typeof options === 'string') {
      this.options = _.merge({}, defaults, { projectRoot: options });
    }
    else {
      this.options = _.merge({}, defaults, options);
    }

    // Import tasks from tasks directory
    var filenames = fs.readdirSync(this.options.taskDir)
      .filter(scriptFilter)
      .map(function(filename) {
        return path.resolve(self.options.taskDir, filename);
      });

    // Register tasks with gulp, using the filename as the task name
    // Files are expected to export a function
    filenames.forEach(function(filename) {
      var taskName = path.basename(filename, path.extname(filename));
      self.tasks[taskName] = require(filename);

      gulp.task(taskName, function() {
        var task = self.tasks[taskName];

        // Check if task is a promise
        if (task && typeof task.then === 'function') {
          return task;
        }
        // Else assume it is a function
        else {
          return task();
        }
      });
    });
  };
}

var task = new GulpDo();
module.exports = task;
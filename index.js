'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var Promise = global.Promise || require('bluebird');
var streamToPromise = require('./lib/stream-to-promise');

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

    var task = this.tasks[name].apply(this.tasks, args);

    if (isPromise(task)) {
      return task;
    }
    else if (isStream(task)) {
      return streamToPromise(task);
    }
    else {
      return Promise.resolve(task);
    }
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
        if (isPromise(task)) {
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

/**
 * Test if input is a promise
 * @param input - Value to test
 * @returns {Boolean}
 */
function isPromise(input) {
  return input && typeof input.then === 'function';
}

/**
 * Test if input is a stream
 * @param input - Value to test
 * @returns {Boolean}
 */
function isStream(input) {
  return !!input && typeof input.on === 'function';
}

var task = new GulpDo();
exports = module.exports = task;
exports.streamToPromise = streamToPromise;

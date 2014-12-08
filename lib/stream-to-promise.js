var Promise = global.Promise || require('bluebird');

/**
 * streamToPromise
 *
 * Accepts a stream and returns a promise that resolves on the stream's
 * end event
 * @param {Stream} stream
 * @returns {Promise}
 */

'use strict';

function streamToPromise(stream) {
  return new Promise(function(resolve, reject) {
    stream.on('end', resolve);
    stream.on('err', reject);
  });
}

module.exports = streamToPromise;

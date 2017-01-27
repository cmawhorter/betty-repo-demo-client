'use strict';

const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: process.env.AWS_REGION });

function request(method, body, callback) {
  lambda.invoke({
    FunctionName:     'central-internal-resource-registry',
    InvocationType:   'RequestResponse',
    Payload:          JSON.stringify({ method, body }),
  }, (err, data) => {
    if (err) return callback(err);
    if (data.StatusCode !== 200) return callback(new Error('invalid response status code: ' + data.StatusCode));
    callback(null, JSON.parse(data.Payload));
  })
}

module.exports = {
  get: function(name, version, callback) {
    request('get', { name, version }, callback);
  },
  publish: function(resource, callback) {
    request('publish', resource, callback);
  },
};

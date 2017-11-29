'use strict';

const Path = require('path');


exports.register = function (server, options) {
  server.dependency('inert');

  server.route([
    {
      method: 'GET',
      path: '/static/{path*}',
      config: {
        auth: false,
        handler: {
          directory: {
            path: Path.join(__dirname, '/build/static/'),
            redirectToSlash: true,
            index: false
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/{path}.json',
      config: {
        auth: false,
        handler: (request, h) => {
          const path = Path.join(__dirname, `/build/${request.params.path}.json`);
          h.file(path);
        }
      }
    },
    {
      method: 'GET',
      path: '/service-worker.js',
      config: {
        auth: false,
        handler: (request, h) => {
          const path = Path.join(__dirname, `/build/service-worker.js`);
          h.file(path);
        }
      }
    },
    {
      method: '*',
      path: '/{path*}',
      config: {
        handler: {
          file: {
            path: Path.join(__dirname, '/build/index.html')
          }
        }
      }
    }
  ]);
};

exports.pkg = require('./package.json');

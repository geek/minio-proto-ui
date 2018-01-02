'use strict';

const Fs = require('fs');
const Path = require('path');
const Inert = require('inert');


let indexFile = Fs.readFileSync(Path.join(__dirname, '../build/index.html')).toString();

exports.register = async function (server, options) {
  await server.register(Inert);

  if (process.env.HTML_HEAD) {
    indexFile = indexFile.replace(/\<\/head\>/i, `${process.env.HTML_HEAD}</head>`);
  }

  server.route([
    {
      method: 'GET',
      path: '/static/{path*}',
      config: {
        auth: false,
        handler: {
          directory: {
            path: Path.join(__dirname, '../build/static/'),
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
          const path = Path.join(__dirname, `../build/${request.params.path}.json`);
          return h.file(path);
        }
      }
    },
    {
      method: 'GET',
      path: '/service-worker.js',
      config: {
        auth: false,
        handler: (request, h) => {
          const path = Path.join(__dirname, `../build/service-worker.js`);
          return h.file(path);
        }
      }
    },
    {
      method: '*',
      path: '/{path*}',
      config: {
        handler: (request, h) => {
          return h.response(indexFile).type('text/html');
        }
      }
    }
  ]);
};

exports.pkg = require('../package.json');

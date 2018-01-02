'use strict';

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const UI = require('../');


const lab = exports.lab = Lab.script();
const it = lab.it;
const expect = Code.expect;


it('can be registered with hapi', async () => {
  const server = Hapi.server();
  await server.register(UI);
  await server.initialize();
  await server.stop();
});

it('can receive requests', async () => {
  const server = Hapi.server();
  await server.register(UI);
  await server.initialize();

  const res = await server.inject('/');
  expect(res.result).to.contain('html');
  await server.stop();
});

it('inserts HTML_HEAD into header', async () => {
  process.env.HTML_HEAD = 'TESTING';
  const server = Hapi.server();
  await server.register(UI);
  await server.initialize();

  const res = await server.inject('/');
  expect(res.result).to.contain('TESTING</head>');
  await server.stop();
});

it('serves manifest.json', async () => {
  const server = Hapi.server();
  await server.register(UI);
  await server.initialize();

  const res = await server.inject('/manifest.json');
  expect(res.result).to.contain('Bridge');
  await server.stop();
});

it('serves service-worker', async () => {
  const server = Hapi.server();
  await server.register(UI);
  await server.initialize();

  const res = await server.inject('/service-worker.js');
  expect(res.result).to.contain('setOfCachedUrls');
  await server.stop();
});

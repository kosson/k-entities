// Importă frameworkul Fastify și creează o instanță
import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import multipart from '@fastify/multipart';
import websocket from '@fastify/websocket';

import { dirname, filename, join } from 'desm';
import validator from 'validator';
import dotenv from 'dotenv';
dotenv.config();

// Node specific
import * as fs from 'node:fs'
import util from 'util';
import { pipeline } from 'stream';
const pump = util.promisify(pipeline);
import PDFParser from "pdf2json";

// instanțiază nodul
import { knode } from './node.js';
import {unixfs} from '@helia/unixfs';
const nixfs = unixfs(knode);        // creează un sistem de fișiere suport pentru nodul Helia, care în acest caz este UnixFS
const encoder = new TextEncoder();  // folosește TextEncoder pentru a transforma string-urile în Uint8Arrays
const decoder = new TextDecoder();  // this decoder will turn Uint8Arrays into strings

// CONECTARE LA NODUL KUBO
import { create, globSource, urlSource } from 'kubo-rpc-client';
// connect to the default API address http://localhost:5001
const kuboClient = await create();



// Obiectul pentru configurarea logging-ului
const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      }
    }
  },
  production: true,
  test: false,
}

if (process.stdout.isTTY) {
  envToLogger.development.transport = {target: 'pino-pretty'};
}

// obiectul opțiunilor de configurare a aplicației
const opts = {
  logger: envToLogger ?? true // defaults to true if no entry matches in the map
}
// instanțiază frameworkul Fastify
// export const app = Fastify(opts);

// cu autoload se încarcă automat toate pluginurile și toate rutele
export async function build (opts) {
  const app = Fastify(opts);

  app.register(autoload, {
    dir: join(import.meta.url, 'plugins'),
    encapsulate: false
  });

  app.register(autoload, {
    dir: join(import.meta.url, 'routes')
  });

  return app;
}
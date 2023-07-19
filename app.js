import dotenv from 'dotenv';
dotenv.config();

// Importă frameworkul Fastify și creează o instanță
import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import {SwaggerTheme} from 'swagger-themes';

import { dirname, filename, join } from 'desm';
import validator from 'validator';

// Node specific
import * as fs from 'node:fs'
import util from 'util';
import { pipeline } from 'stream';
const pump = util.promisify(pipeline);
import PDFParser from "pdf2json";

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

  app.register(swagger);
  app.register(swaggerUI, {
    theme: {
      css: [
        {filename: 'theme.css', content: new SwaggerTheme('v3').getBuffer('dark')}
      ]
    }
  });

  app.register(autoload, {
    dir: join(import.meta.url, 'plugins'),
    encapsulate: false
  });

  app.register(autoload, {
    dir: join(import.meta.url, 'routes')
  });

  return app;
}
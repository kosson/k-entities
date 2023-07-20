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
import * as fs from 'node:fs';
import util from 'util';
import test from 'node:test';
import assert from 'node:assert';
import { pipeline } from 'stream';
const pump = util.promisify(pipeline);
import PDFParser from "pdf2json";

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

  // rutele beneficază de acceași aplicație
  app.register(autoload, {
    dir: join(import.meta.url, 'plugins'),
    encapsulate: false
  });

  app.register(autoload, {
    dir: join(import.meta.url, 'routes')
  });

  app.setErrorHandler(async (err, request, reply) => {
    if (err.validation) {
      reply.code(403);
      return err.message;
    }
    request.log.error({err});
    reply.code(err.statusCode || 500);
    
    return "A apărut o eroare în prelucrarea cererii tale";
  });

  return app;
}
import dotenv from 'dotenv';
dotenv.config();

import multipart from '@fastify/multipart';

import * as fs from 'node:fs';
import util from 'util';
import { pipeline } from 'stream';
const pump = util.promisify(pipeline);

export default async function hndlUpload (app, opts) {
  // Registering Fastify ecosystem parts
  app.register(multipart); // înrolează modulul `multipart`
  // Ruta de upload și prelucrare
  app.post('/upload', async function uploadMultiform (request, reply) {
    const parts = request.parts(); // pentru a prelucra și restul datelor din câmpuri, nu numai fișierele
    const data = [];
    for await (const part of parts) {
      if (part.file) {
        await pump(part.file, fs.createWriteStream(`./localstore/${part.filename}`));
      } else {
        // data.push(JSON.stringify(part.fields));
        if (part.type === 'field') {
          let fldata = {
            name: part.fieldname,
            value: part.value
          }
          data.push(fldata);
        }      
      }
    }
    return {
      message : 'Am primit datele',
      metadata: data
    };
  });
};  
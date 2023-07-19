import dotenv from 'dotenv';
dotenv.config();
// instanțiază nodul
import { knode } from '../../node.js';
import {unixfs} from '@helia/unixfs';
const nixfs = unixfs(knode);        // creează un sistem de fișiere suport pentru nodul Helia, care în acest caz este UnixFS
const encoder = new TextEncoder();  // folosește TextEncoder pentru a transforma string-urile în Uint8Arrays
const decoder = new TextDecoder();  // this decoder will turn Uint8Arrays into strings

export default async function (app, opts) {
  // Creează prima rută de test
  app.get('/test', {
    handler: async function handlerRoot (request, reply) {

      app.log.info('Am primite cerere de testare');
      // creează un content identifier
      const identificatorDeTest = await nixfs.addBytes(encoder.encode('Salutare, prietene!'));
    
      console.log('Adaug datelele identificate prin:', identificatorDeTest.toString());
      let text = '';
    
      // use the second Helia node to fetch the file from the first Helia node
      for await (const chunk of nixfs.cat(identificatorDeTest)) {
          text += decoder.decode(chunk, {
              stream: true
          })
      }
      return reply.code(200).send({ 
        CID: identificatorDeTest,
        content: text 
      });
    }
  });
}
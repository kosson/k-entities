import dotenv from 'dotenv';
dotenv.config();

import closeWithGrace from 'close-with-grace';
import {build} from './app.js';

try {
  // Obiectul pentru configurarea logging-ului
  const envToLogger = {
    level: 'info',
    development: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        }
      }
    },
    production: false,
    test: false,
  }

  // obiectul opțiunilor de configurare ale aplicației
  const opts = {
    logger: envToLogger ?? true // defaults to true if no entry matches in the map
  }

  const server = await build(opts); // instanțierea aplicației

  const port = process.env.PORT || 3300;
  const host = process.env.HOST || '127.0.0.1';

  async function runServer () {
    try {
      await server.listen({port, host}); // pornirea serverului
      // console.log(`server listening on ${app.server.address().port}`);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  // ["SIGINT", "SIGTERM"].forEach((signal) => {
  //     process.on(signal, async () => {
  //         await server.close();
  //         process.exit(0);
  //     });
  // });

  closeWithGrace(async ({err}) => {
    if (err) {
        server.log.error({err}, 'Serverul a fost oprit datorită unei erori');
    }
    server.log.info('Închid serverul așa cum trebuie');
    await server.close();
  });

  await runServer();
} catch (error) {
  if (error) throw error;
}
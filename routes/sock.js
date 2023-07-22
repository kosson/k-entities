import dotenv from 'dotenv';
dotenv.config();

import websocket from '@fastify/websocket';

function handleConn (error, conn /* SocketStream */, req /* FastifyRequest */, reply /* FastifyReply */) {
  if (error) {
    conn.destroy(error);
  }
  conn.pipe(conn) // creează un mecanism de ecou pentru testarea websocketului
}

export default async function hndlsockets (app, opts) {
  app.register(websocket, {
    handleConn,
    options: { maxPayload: 1048576 } // setăm numărul maxim de mesaje permise la 1 MiB (1024 bytes * 1024 bytes)
  }); // înrolează modulul `websockets`


  app.register(async function router4socks () {
    app.route({
      method: 'GET',
      url: '/sock',
      handler: (reqest, reply) => {
        // metoda va gestiona cererile http
        reply.send({salut: 'Ce faci?'});
      },
      wsHandler: (conn, req) => {
        conn.setEncoding('utf8');
        conn.write('Bine ai venit, prietene!');
        conn.socket.on('message', (message) => {
          conn.socket.send('Mesaj de la Fastify WebSockets');
        });
      }
    });
  });
};
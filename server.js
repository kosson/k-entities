import dotenv from 'dotenv';
dotenv.config();

import {build} from './app.js';
const server = await build();

const port = process.env.PORT || 3300;
const host = process.env.HOST || '127.0.0.1';

async function runServer () {
    try {
        await server.listen({port, host});
        // console.log(`server listening on ${app.server.address().port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
        await server.close();
        process.exit(0);
    });
});

await runServer();
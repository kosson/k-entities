export default async function hndlNotFound (app, opts) {
    app.setNotFoundHandler(async (request, reply) => {
        reply.code(404);
        return 'Ceea ce cauți, nu există';
    });
}
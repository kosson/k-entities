export default async function (app, opts) {
    app.setNotFoundHandler(async (request, reply) => {
        reply.code(404);
        return 'Ceea ce cauți, nu există';
    });
}
export default async function (app, opts) {
    app.setErrorHandler(async (err, request, reply) => {
        if (err.validation) {
            reply.code(403);
            return err.message;
        }
        request.log.error({err});
        reply.code(err.statusCode || 500);

        return 'A apărut o eroare la procesarea cererii';
    });
}
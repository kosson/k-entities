export default async function hndlErr (app, opts) {
    app.setErrorHandler(async function customErrHnld (err, request, reply) {
        // funcția se execută ori de câte ori un obiect Error sau un JSON este thrown sau sent.
        if (err.validation) {
            reply.code(403);
            return err.message;
        }
        request.log.error({err});
        reply.code(err.statusCode || 500);

        return 'A apărut o eroare la procesarea cererii';
    });
};
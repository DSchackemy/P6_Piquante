const http = require ('http');
const app = require ('./app');

//La fonction normalizePort renvoie un port valide qu'il soit fourni sous la forme d'un numero ou d'une chaine
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//la fonction errorHandler recherche les differentes erreurs et les gère de manière appropriée. Elle est ensuite enregistré sur le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);

// un ecouteur d'evenement est egalement enregistré, consignant le port ou le canal nommé sur lequel le serveur s'execute dans la console.
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);